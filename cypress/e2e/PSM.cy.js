import { unserialize, formatPrice, extractFormattedNumber } from '../support/utils';

describe('PSM tests', () => {
  const requests = {
    psm: { metrics: {}, governance: {} },
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
    });
    cy.visit('/psm');
  });

  it('should match minted IST values', () => {
    cy.get('[data-testid^="psm-minted-ist-"]').spread((...elements) => {
      expect(elements.length).to.equal(Object.keys(requests.psm.metrics).length);
      elements.forEach((element) => {
        const tokenName = element.getAttribute('data-testid').split('-').at(-1);
        const token = requests.psm.metrics[tokenName];
        const capData = JSON.parse(JSON.parse(token.value).values[0]);
        const unMarshaled = unserialize(capData);
        const value = Number(unMarshaled.mintedPoolBalance.value) / 1_000_000;
        const formattedValue = formatPrice(value);

        const [, valueCalculated, symbolCalculated] = extractFormattedNumber(element.innerHTML);
        const [, valueActual, symbolActual] = extractFormattedNumber(formattedValue);

        expect(Math.abs(valueCalculated - valueActual)).to.be.lessThan(0.02);
        expect(symbolActual).to.equal(symbolCalculated);
      });
    });
  });
});
