/* global document, window, hljs */

document.addEventListener('DOMContentLoaded', () => {
  const bamLogo = document.querySelector('#bam-logo');
  const nav = document.querySelector('nav');
  const main = document.querySelector('main');
  const header = document.querySelector('header');
  const closeNav = document.querySelector('#close-nav');
  const homeLink = document.querySelector('#home-link');
  const caseStudy = document.querySelector('#case-study');
  const introduction = document.querySelector('#introduction');
  const caseStudyNav = document.querySelector('#case-study nav');
  const caseStudyLink = document.querySelector('#case-study-link');
  // const githubLogo = document.querySelector('#github-logo');
  // const mediumLogo = document.querySelector('#medium-logo');
  const logoLinks = document.querySelector('.logo-links');
  // const ourTeamLink = document.querySelector('#our-team-link');
  const caseStudyNavUl = document.querySelector('#case-study nav ul');

  let navVisible = false;
  const getScrollPosition = () => window.scrollY;
  let scrollPosition = getScrollPosition();

  const snakeCaseify = text => text.toLowerCase().split(' ').join('-');

  const h2Text = [...document.querySelectorAll('h2')].map(h2 => (
    h2.textContent.split(' ').slice(1).join(' ')
  ));
  const positions = h2Text.reduce((obj, h2Str) => {
    const selector = `#${snakeCaseify(h2Str.replace('!', ''))}`;
    const h2 = document.querySelector(selector);
    const position = getScrollPosition() + h2.getBoundingClientRect().top;
    obj[`${selector}-nav`] = position;
    return obj;
  }, {});

  const highlightSection = (li, a) => {
    li.style.listStyle = 'disc';
    li.style.color = '#9eba2a';
    li.style.fontSize = '1.6em';
    li.style.fontWeight = 'bold';
    li.style.marginLeft = '1.7em';
    a.style.color = '#9eba2a';
    a.style.marginBottom = '1.75em';
  };

  const unhighlightSection = (li, a) => {
    li.style.listStyle = 'circle';
    li.style.color = '#999';
    li.style.fontSize = '2em';
    li.style.fontWeight = 'normal';
    li.style.marginLeft = '2em';
    a.style.color = '#999';
    a.style.marginBottom = '2em';
  }

  h2Text.forEach((h2TextStr, i) => {
    const li = document.createElement('li');
    li.id = `${h2TextStr.toLowerCase()}-nav`;
    const a = document.createElement('a');
    a.href = snakeCaseify(`#${h2TextStr.replace('!', '')}`);
    a.textContent = h2TextStr.toUpperCase();

    if (i === 0) {
      highlightSection(li, a);
    } else {
      unhighlightSection(li, a);
    }

    li.appendChild(a);
    caseStudyNavUl.appendChild(li);
  });

  const changeImgSrc = (tag, url) => {
    document.querySelector(`#${tag}`).src = url;
  };

  const logoUrls = {
    githubWhite: 'https://i.imgur.com/7X29Lfl.png',
    githubBlack: 'https://i.imgur.com/uS9im3Z.png',
    mediumWhite: 'https://i.imgur.com/iAreLP9.png',
    mediumBlack: 'https://i.imgur.com/IPiAMRb.png',
    mediumWhiteAlt: 'https://i.imgur.com/DP4t04E.png',
  };

  const changeLogoColors = (logo, location) => {
    scrollPosition = getScrollPosition();

    if (scrollPosition < location) {
      changeImgSrc(`${logo}-logo`, logoUrls[`${logo}White`]);
    } else {
      changeImgSrc(`${logo}-logo`, logoUrls[`${logo}Black`]);
    }
  };

  const showNav = () => {
    navVisible = true;
    scrollPosition = getScrollPosition();
    nav.style.display = 'block';
    main.style.display = 'none';
    header.style.display = 'none';
    ['github', 'medium'].forEach(logo => changeImgSrc(`${logo}-logo`, logoUrls[`${logo}Black`]));
    // ['github', 'medium'].forEach(logo => changeImgSrc(`${logo}-logo`, logoUrls[`${logo}White`]));
  };

  const hideNav = () => {
    navVisible = false;
    nav.style.display = 'none';
    main.style.display = 'block';
    header.style.display = 'block';
    window.scrollTo(0, scrollPosition);

    changeLogoColors('github', 130);
    changeLogoColors('medium', 90);
  };

  bamLogo.addEventListener('click', showNav);
  closeNav.addEventListener('click', hideNav);
  homeLink.addEventListener('click', hideNav);
  caseStudyLink.addEventListener('click', hideNav);
  // ourTeamLink.addEventListener('click', hideNav);

  document.addEventListener('scroll', () => {
    if (!navVisible) {
      changeLogoColors('github', 130);
      changeLogoColors('medium', 90);
      const mainPosition = getScrollPosition() + main.getBoundingClientRect().top;

      // must be less than team section position
      if ((scrollPosition) >= mainPosition) {
        caseStudyNav.style.display = 'block';
      } else {
        caseStudyNav.style.display = 'none';
      }

      // must be less than team section position
      const positionValues = Object.values(positions);
      const positionSelectors = Object.keys(positions);
      if (scrollPosition >= positionValues[0] && scrollPosition < positionValues[1]) {
        const li = document.querySelector(positionSelectors[0]);
        const a = li.getElementsByTagName('a')[0];
        highlightSection(li, a);
      } else {
        const li = document.querySelector(positionSelectors[0]);
        const a = li.getElementsByTagName('a')[0];
        unhighlightSection(li, a);
      }
    }
  });

  logoLinks.addEventListener('mouseover', (e) => {
    if (navVisible) {
      const { id } = e.target;
      const urlKey = /github/.test(id) ? 'githubWhite' : 'mediumWhiteAlt';
      changeImgSrc(id, logoUrls[urlKey]);
    }
  });

  logoLinks.addEventListener('mouseout', (e) => {
    if (navVisible) {
      const { id } = e.target;
      const logo = id.split('-')[0];
      const urlKey = `${logo}Black`;
      changeImgSrc(id, logoUrls[urlKey]);
    }
  });

  hljs.initHighlightingOnLoad();
});
