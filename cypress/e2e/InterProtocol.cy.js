import { unserialize, formatIST, formatPercent, formatPrice, extractFormattedNumber } from '../support/utils';

describe('Interprotocol tests', () => {
  const requests = {
    psm: { metrics: {}, governance: {} },
    vaultManagers: { metrics: {}, governance: {} },
    reserve: { metrics: {} },
    priceFeed: {},
  };
  before(() => {
    cy.request('https://main.api.agoric.net/agoric/vstorage/children/published.psm.IST').then((resp) => {
      resp.body.children.forEach((token) => {
        cy.request(`https://main.api.agoric.net/agoric/vstorage/data/published.psm.IST.${token}.metrics`).then(
          (metrics) => {
            requests.psm.metrics[token] = metrics.body;
          },
        );
      });
      resp.body.children.forEach((token) => {
        cy.request(`https://main.api.agoric.net/agoric/vstorage/data/published.psm.IST.${token}.governance`).then(
          (governance) => {
            requests.psm.governance[token] = governance.body;
          },
        );
      });
    });

    cy.request('https://main.api.agoric.net/agoric/vstorage/children/published.vaultFactory.managers').then((resp) => {
      resp.body.children.forEach((manager) => {
        cy.request(
          `https://main.api.agoric.net/agoric/vstorage/data/published.vaultFactory.managers.${manager}.metrics`,
        ).then((metrics) => {
          requests.vaultManagers.metrics[manager] = metrics.body;
        });
      });
      resp.body.children.forEach((manager) => {
        cy.request(
          `https://main.api.agoric.net/agoric/vstorage/data/published.vaultFactory.managers.${manager}.governance`,
        ).then((governance) => {
          requests.vaultManagers.governance[manager] = governance.body;
        });
      });
    });

    cy.request('https://main.api.agoric.net/agoric/vstorage/data/published.reserve.metrics').then((resp) => {
      requests.reserve.metrics = resp.body;
    });

    cy.request('https://main.api.agoric.net/agoric/vstorage/children/published.priceFeed').then((resp) => {
      resp.body.children.forEach((priceFeedName) => {
        cy.request(`https://main.api.agoric.net/agoric/vstorage/data/published.priceFeed.${priceFeedName}`).then(
          (priceFeed) => {
            requests.priceFeed[priceFeedName] = priceFeed.body;
          },
        );
      });
    });
    cy.visit('/');
  });

  it('should match IST in circulation', () => {
    let totalPsmMinted = 0;
    let totalDebt = 0;

    cy.get('[data-testid="inter-protocol-minted"]')
      .invoke('html')
      .then((args) => {
        Object.values(requests.psm.metrics).forEach((token) => {
          const capData = JSON.parse(JSON.parse(token.value).values[0]);
          const unMarshaled = unserialize(capData);
          totalPsmMinted += Number(unMarshaled.mintedPoolBalance.value);
        });
        Object.values(requests.vaultManagers.metrics).forEach((manager) => {
          const capData = JSON.parse(JSON.parse(manager.value).values[0]);
          const unMarshaled = unserialize(capData);
          totalDebt += Number(unMarshaled.totalDebt.value);
        });
        return cy.wrap(args);
      })
      .then((displayedValue) => {
        const value = (totalDebt + totalPsmMinted) / 1_000_000;
        const formattedValue = formatIST(value);

        const [, valueCalculated, symbolCalculated] = extractFormattedNumber(formattedValue);
        const [, valueActual, symbolActual] = extractFormattedNumber(displayedValue);

        expect(Math.abs(valueCalculated - valueActual)).to.be.lessThan(0.02);
        expect(symbolActual).to.equal(symbolCalculated);
      });
  });

  it('should match Total mint limit', () => {
    let vaultMintLimit = 0;
    let psmMintLimit = 0;

    cy.get('[data-testid="inter-protocol-mint-limit"]')
      .invoke('html')
      .then((args) => {
        Object.values(requests.psm.governance).forEach((token) => {
          const capData = JSON.parse(JSON.parse(token.value).values[0]);
          const unMarshaled = unserialize(capData);
          psmMintLimit += Number(unMarshaled.current.MintLimit.value.value);
        });
        Object.values(requests.vaultManagers.governance).forEach((manager) => {
          const capData = JSON.parse(JSON.parse(manager.value).values[0]);
          const unMarshaled = unserialize(capData);
          vaultMintLimit += Number(unMarshaled.current.DebtLimit.value.value);
        });
        return cy.wrap(args);
      })
      .then((displayedValue) => {
        const value = (vaultMintLimit + psmMintLimit) / 1_000_000;
        const formattedValue = formatIST(value);

        const [, valueCalculated, symbolCalculated] = extractFormattedNumber(formattedValue);
        const [, valueActual, symbolActual] = extractFormattedNumber(displayedValue);

        expect(Math.abs(valueCalculated - valueActual)).to.be.lessThan(0.02);
        expect(symbolActual).to.equal(symbolCalculated);
      });
  });

  it('should match Total mint limit utilized', () => {
    let totalPsmMinted = 0;
    let totalDebt = 0;
    let vaultMintLimit = 0;
    let psmMintLimit = 0;

    cy.get('[data-testid="inter-protocol-mint-limit-utilized"]')
      .invoke('html')
      .then((args) => {
        Object.values(requests.psm.metrics).forEach((token) => {
          const capData = JSON.parse(JSON.parse(token.value).values[0]);
          const unMarshaled = unserialize(capData);
          totalPsmMinted += Number(unMarshaled.mintedPoolBalance.value);
        });
        Object.values(requests.vaultManagers.metrics).forEach((manager) => {
          const capData = JSON.parse(JSON.parse(manager.value).values[0]);
          const unMarshaled = unserialize(capData);
          totalDebt += Number(unMarshaled.totalDebt.value);
        });
        Object.values(requests.psm.governance).forEach((token) => {
          const capData = JSON.parse(JSON.parse(token.value).values[0]);
          const unMarshaled = unserialize(capData);
          psmMintLimit += Number(unMarshaled.current.MintLimit.value.value);
        });
        Object.values(requests.vaultManagers.governance).forEach((manager) => {
          const capData = JSON.parse(JSON.parse(manager.value).values[0]);
          const unMarshaled = unserialize(capData);
          vaultMintLimit += Number(unMarshaled.current.DebtLimit.value.value);
        });
        return cy.wrap(args);
      })
      .then((displayedValue) => {
        const totalMinted = (totalDebt + totalPsmMinted) / 1_000_000;
        const totalMintLimit = (vaultMintLimit + psmMintLimit) / 1_000_000;
        const formattedValue = formatPercent(totalMinted / totalMintLimit);

        const [, valueCalculated] = extractFormattedNumber(formattedValue);
        const [, valueActual] = extractFormattedNumber(displayedValue);

        expect(Math.abs(valueCalculated - valueActual)).to.be.lessThan(0.02);
      });
  });

  it('should match Total reserve assets', () => {
    let totalReserveAssets = 0;
    const oraclePrices = {};

    cy.get('[data-testid="inter-protocol-total-reserve-assets"]')
      .invoke('html')
      .then((args) => {
        Object.entries(requests.priceFeed).forEach(([key, priceFeed]) => {
          const name = key.split('-')[0].toLowerCase();
          const capData = JSON.parse(JSON.parse(priceFeed.value).values[0]);
          const unMarshaled = unserialize(capData);
          oraclePrices[name] = unMarshaled;
        });
        Object.values(requests.reserve.metrics).forEach((metric) => {
          const capData = JSON.parse(JSON.parse(metric).values[0]);
          const unMarshaled = unserialize(capData);
          Object.entries(unMarshaled.allocations).map(([key, val]) => {
            const tokenPriceFeed = oraclePrices[key.toLowerCase()];
            const amountOut = Number(tokenPriceFeed?.amountOut.value || 1_000_000) / 1_000_000;
            totalReserveAssets += (Number(val.value) / 1_000_000) * amountOut;
          });
        });
        return cy.wrap(args);
      })
      .then((displayedValue) => {
        const formattedValue = formatPrice(totalReserveAssets);

        const [, valueCalculated, symbolCalculated] = extractFormattedNumber(formattedValue);
        const [, valueActual, symbolActual] = extractFormattedNumber(displayedValue);

        expect(Math.abs(valueCalculated - valueActual)).to.be.lessThan(0.02);
        expect(symbolActual).to.equal(symbolCalculated);
      });
  });

  it('should match Total minted IST', () => {
    let totalPsmMinted = 0;
    let totalDebt = 0;

    cy.get('[data-testid="inter-protocol-total-minted"]')
      .invoke('html')
      .then((args) => {
        Object.values(requests.psm.metrics).forEach((token) => {
          const capData = JSON.parse(JSON.parse(token.value).values[0]);
          const unMarshaled = unserialize(capData);
          totalPsmMinted += Number(unMarshaled.mintedPoolBalance.value);
        });
        Object.values(requests.vaultManagers.metrics).forEach((manager) => {
          const capData = JSON.parse(JSON.parse(manager.value).values[0]);
          const unMarshaled = unserialize(capData);
          totalDebt += Number(unMarshaled.totalDebt.value);
        });
        return cy.wrap(args);
      })
      .then((displayedValue) => {
        const value = (totalDebt + totalPsmMinted) / 1_000_000;
        const formattedValue = formatIST(value);

        const [, valueCalculated, symbolCalculated] = extractFormattedNumber(formattedValue);
        const [, valueActual, symbolActual] = extractFormattedNumber(displayedValue);

        expect(Math.abs(valueCalculated - valueActual)).to.be.lessThan(0.02);
        expect(symbolActual).to.equal(symbolCalculated);
      });
  });

  it('should match Total Collateral Value Locked', () => {
    let totalCollateralValueLocked = 0;
    const oraclePrices = {};

    cy.get('[data-testid="inter-protocol-total-collateral-value-locked"]')
      .invoke('html')
      .then((args) => {
        Object.entries(requests.priceFeed).forEach(([key, priceFeed]) => {
          const name = key.split('-')[0].toLowerCase();
          const capData = JSON.parse(JSON.parse(priceFeed.value).values[0]);
          const unMarshaled = unserialize(capData);
          oraclePrices[name] = unMarshaled;
        });

        Object.values(requests.vaultManagers.metrics).forEach((manager) => {
          const capData = JSON.parse(JSON.parse(manager.value).values[0]);
          const unMarshaled = unserialize(capData);
          const brandName = String(unMarshaled.liquidatingCollateral.brand).split(' ').at(-2);
          const tokenPriceFeed = oraclePrices[brandName.toLowerCase()];
          const amountOut = Number(tokenPriceFeed?.amountOut.value || 1_000_000) / 1_000_000;
          totalCollateralValueLocked += (Number(unMarshaled.totalCollateral.value) / 1_000_000) * amountOut;
        });
        return cy.wrap(args);
      })
      .then((displayedValue) => {
        const formattedValue = formatPrice(totalCollateralValueLocked);

        const [, valueCalculated, symbolCalculated] = extractFormattedNumber(formattedValue);
        const [, valueActual, symbolActual] = extractFormattedNumber(displayedValue);

        expect(Math.abs(valueCalculated - valueActual)).to.be.lessThan(0.02);
        expect(symbolActual).to.equal(symbolCalculated);
      });
  });

  it('should match IST minted by vaults', () => {
    let totalDebt = 0;

    cy.get('[data-testid="inter-protocol-ist-minted-vaults"]')
      .invoke('html')
      .then((args) => {
        Object.values(requests.vaultManagers.metrics).forEach((manager) => {
          const capData = JSON.parse(JSON.parse(manager.value).values[0]);
          const unMarshaled = unserialize(capData);
          totalDebt += Number(unMarshaled.totalDebt.value);
        });
        return cy.wrap(args);
      })
      .then((displayedValue) => {
        const value = totalDebt / 1_000_000;
        const formattedValue = formatIST(value);

        const [, valueCalculated, symbolCalculated] = extractFormattedNumber(formattedValue);
        const [, valueActual, symbolActual] = extractFormattedNumber(displayedValue);

        expect(Math.abs(valueCalculated - valueActual)).to.be.lessThan(0.02);
        expect(symbolActual).to.equal(symbolCalculated);
      });
  });

  it('should match Total PSM assests', () => {
    let totalAnchorPoolBalance = 0;

    cy.get('[data-testid="inter-protocol-total-psm-assets"]')
      .invoke('html')
      .then((args) => {
        Object.values(requests.psm.metrics).forEach((token) => {
          const capData = JSON.parse(JSON.parse(token.value).values[0]);
          const unMarshaled = unserialize(capData);
          totalAnchorPoolBalance += Number(unMarshaled.anchorPoolBalance.value);
        });

        return cy.wrap(args);
      })
      .then((displayedValue) => {
        const value = totalAnchorPoolBalance / 1_000_000;
        const formattedValue = formatPrice(value);

        const [, valueCalculated, symbolCalculated] = extractFormattedNumber(formattedValue);
        const [, valueActual, symbolActual] = extractFormattedNumber(displayedValue);

        expect(Math.abs(valueCalculated - valueActual)).to.be.lessThan(0.02);
        expect(symbolActual).to.equal(symbolCalculated);
      });
  });

  it('should match IST minted by PSM', () => {
    let totalPsmMinted = 0;

    cy.get('[data-testid="inter-protocol-ist-minted-psm"]')
      .invoke('html')
      .then((args) => {
        Object.values(requests.psm.metrics).forEach((token) => {
          const capData = JSON.parse(JSON.parse(token.value).values[0]);
          const unMarshaled = unserialize(capData);
          totalPsmMinted += Number(unMarshaled.mintedPoolBalance.value);
        });
        return cy.wrap(args);
      })
      .then((displayedValue) => {
        const value = totalPsmMinted / 1_000_000;
        const formattedValue = formatIST(value);

        const [, valueCalculated, symbolCalculated] = extractFormattedNumber(formattedValue);
        const [, valueActual, symbolActual] = extractFormattedNumber(displayedValue);

        expect(Math.abs(valueCalculated - valueActual)).to.be.lessThan(0.02);
        expect(symbolActual).to.equal(symbolCalculated);
      });
  });

  it('should match Reserve shortfall', () => {
    let reserveShortfall = 0;

    cy.get('[data-testid="inter-protocol-reserve-shortfall"]')
      .invoke('html')
      .then((args) => {
        Object.values(requests.reserve.metrics).forEach((metric) => {
          const capData = JSON.parse(JSON.parse(metric).values[0]);
          const unMarshaled = unserialize(capData);
          reserveShortfall += Number(unMarshaled.shortfallBalance.value);
        });

        return cy.wrap(args);
      })
      .then((displayedValue) => {
        const value = reserveShortfall / 1_000_000;
        const formattedValue = formatPrice(value);

        const [, valueCalculated, symbolCalculated] = extractFormattedNumber(formattedValue);
        const [, valueActual, symbolActual] = extractFormattedNumber(displayedValue);

        expect(Math.abs(valueCalculated - valueActual)).to.be.lessThan(0.02);
        expect(symbolActual).to.equal(symbolCalculated);
      });
  });
});
