/* global document, window, hljs */

document.addEventListener('DOMContentLoaded', () => {
  const bamLogo = document.querySelector('#bam-logo');
  const nav = document.querySelector('nav');
  const main = document.querySelector('main');
  const closeNav = document.querySelector('#close-nav');
  const homeLink = document.querySelector('#home-link');
  const caseStudy = document.querySelector('#case-study');
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

  const h2Text = [...document.querySelectorAll('h2')].map(h2 => (
    h2.textContent.split(' ').slice(1).join(' ')
  ));

  const snakeCaseify = text => text.toLowerCase().split(' ').join('-');

  h2Text.forEach((h2TextStr) => {
    const li = document.createElement('li');
    li.textContent = '□';
    const a = document.createElement('a');
    a.href = snakeCaseify(`#${h2TextStr.replace('!', '')}`);
    a.textContent = h2TextStr.toUpperCase();

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
    ['github', 'medium'].forEach(logo => changeImgSrc(`${logo}-logo`, logoUrls[`${logo}Black`]));
    // ['github', 'medium'].forEach(logo => changeImgSrc(`${logo}-logo`, logoUrls[`${logo}White`]));
  };

  const hideNav = () => {
    navVisible = false;
    nav.style.display = 'none';
    main.style.display = 'block';
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
      const caseStudyPosition = getScrollPosition() + caseStudy.getBoundingClientRect().top;

      // must be less than team section position
      if ((scrollPosition + 300) >= caseStudyPosition) {
        caseStudyNav.style.display = 'block';
      } else {
        caseStudyNav.style.display = 'none';
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
