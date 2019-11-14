const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
*/

const program = (() => {
  let input;
  let results;

  function empty() {
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }
  }

  function el(name, ...children) {/* eslint-disable-line */
    const element = document.createElement(name);

    for (const child of children) {/* eslint-disable-line */
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child) {
        element.appendChild(child);
      }
    }
    return element;
  }

  function display(data) {
    empty();

    if (Object.keys(data).length === 0) {
      results.appendChild(el('p', 'Ekkert fyrirtæki fannst fyrir leitarstreng'));
      return;
    }

    for (const item of data) {/* eslint-disable-line */
      const div = el('div',
        el('dl',
          el('dt', 'Nafn'),
          el('dd', item.name),
          el('dt', 'Kennitala'),
          el('dd', item.sn),
          item.active ? el('dt', 'Heimilisfang') : null,
          item.active ? el('dd', item.address) : null));
      div.classList.add('company');
      item.active ? div.classList.add('company--active') : div.classList.add('company--inactive'); /* eslint-disable-line no-unused-expressions */
      results.appendChild(div);
    }
  }

  function displayMsg(msg) {
    empty();
    const message = el('p', msg);
    results.appendChild(message);
  }

  function loading() {
    empty();

    const load = el('div', el('img'), el('p', 'Leita að fyrirtækjum...'));
    load.classList.add('loading');

    const img = load.querySelector('img');
    img.setAttribute('alt', '');
    img.setAttribute('src', 'loading.gif');

    results.appendChild(load);
  }

  function fetchData(comp) {
    loading();

    fetch(`${API_URL}${comp}`)
      .then((response) => {
        if (!response.ok) {
          throw Error('Villa við að sækja gögn');
        }
        return response.json();
      })
      .then((data) => {
        display(data.results);
      })
      .catch(() => {
        console.error('Villa við að sækja gögn'); /* eslint-disable-line */
        displayMsg('Villa við að sækja gögn');
      });
  }

  function submitEl(e) {
    e.preventDefault();

    const comp = input.value;

    if (typeof comp !== 'string' || comp === '') {
      displayMsg('Fyrirtæki verður að vera strengur');
    } else {
      fetchData(comp);
    }
  }

  function init(companies) {
    const form = companies.querySelector('form');
    input = form.querySelector('input');
    results = companies.querySelector('.results');

    form.addEventListener('submit', submitEl);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('.companies');
  program.init(companies);
});
