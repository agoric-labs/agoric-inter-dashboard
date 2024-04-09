import { unserialize, formatIST } from '../support/utils';

describe('Interprotocol tests', () => {
  const requests = {
    psm: { metrics: {}, governance: {} },
    vaultManagers: { metrics: {}, governance: {} },
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
      .then((mintedValue) => {
        const value = (totalDebt + totalPsmMinted) / 1_000_000;
        const formattedValue = formatIST(value);

        const valueCalculated = Number(mintedValue.slice(0, -2));
        const valueActual = Number(formattedValue.slice(0, -2));
        const symbolCalculated = mintedValue.at(-1);
        const symbolActual = formattedValue.at(-1);

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
      .then((totalMintLimit) => {
        cy.pause();
        const value = (vaultMintLimit + psmMintLimit) / 1_000_000;
        const formattedValue = formatIST(value);

        const valueCalculated = Number(totalMintLimit.slice(0, -2));
        const valueActual = Number(formattedValue.slice(0, -2));
        const symbolCalculated = totalMintLimit.at(-1);
        const symbolActual = formattedValue.at(-1);

        expect(Math.abs(valueCalculated - valueActual)).to.be.lessThan(0.02);
        expect(symbolActual).to.equal(symbolCalculated);
      });
  });
});
