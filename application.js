/* global document, window, hljs */

document.addEventListener('DOMContentLoaded', () => {
  const bamLogo = document.querySelector('#bam-logo');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('#site-navigation a');
  const main = document.querySelector('main');
  const header = document.querySelector('header');
  const ourTeam = document.querySelector('#our-team');
  const homeLink = document.querySelector('#home-link');
  const caseStudyNav = document.querySelector('#case-study nav');
  const caseStudyLink = document.querySelector('#case-study-link');
  const logoLinks = document.querySelector('.logo-links');
  const ourTeamLink = document.querySelector('#our-team-link');
  const caseStudyNavUl = document.querySelector('#case-study nav ul');

  let navVisible = false;
  const getScrollPosition = () => window.scrollY;
  let scrollPosition = getScrollPosition();
  const getWindowHeight = () => window.innerHeight;
  const logos = [...document.querySelectorAll('.logo-links img')]
    .filter(logo => !(/bam/.test(logo.id)))
    .map(logo => logo.id.split('-')[0]);


  const snakeCaseify = text => text.toLowerCase().split(' ').join('-');

  const h2Text = [...document.querySelectorAll('h2')].map(h2 => (
    h2.textContent.split(' ').slice(1).join(' ')
  ));

  const highlightSection = (li, a) => {
    li.style.listStyle = 'disc';
    li.style.fontWeight = 'bold';
    li.style.color = '#9eba2a';
    a.style.color = '#9eba2a';
  };

  h2Text.forEach((h2TextStr) => {
    const li = document.createElement('li');
    li.id = snakeCaseify(`${h2TextStr.replace('!', '').toLowerCase()}-nav`);
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
    mediumWhite: 'https://i.imgur.com/DP4t04E.png',
    mediumBlack: 'https://i.imgur.com/IPiAMRb.png',
    bamWhite: 'https://i.imgur.com/zSuO4RT.png',
    bamBlack: 'https://i.imgur.com/798Mohw.png',
  };

  const changeLogoColors = () => {
    logos.forEach((logo) => {
      scrollPosition = getScrollPosition();
      const logoSelector = `#${logo}-logo`;
      const logoElement = document.querySelector(logoSelector);
      const logoHeight = logoElement.height;
      const logoBottom = +window.getComputedStyle(logoElement).bottom.replace('px', '');
      const logoOffset = logoHeight + logoBottom;

      if (scrollPosition > logoOffset) {
        changeImgSrc(`${logo}-logo`, logoUrls[`${logo}Black`]);
      } else {
        changeImgSrc(`${logo}-logo`, logoUrls[`${logo}White`]);
      }
    });
  };

  const onFooter = () => {
    scrollPosition = getScrollPosition();
    const ourTeamPosition = ourTeam.getBoundingClientRect().top;
    const ourTeamOffset = (scrollPosition + ourTeamPosition) - getWindowHeight();
    const logoSelector = '#bam-logo';
    const logoElement = document.querySelector(logoSelector);
    const logoHeight = logoElement.height;
    const logoTop = +window.getComputedStyle(logoElement).top.replace('px', '');
    const logoOffset = logoHeight + logoTop;
    return scrollPosition > ourTeamOffset + (getWindowHeight() - logoOffset);
  };

  const changeBamLogoColor = () => {
    if (onFooter()) {
      changeImgSrc('bam-logo', 'https://i.imgur.com/798Mohw.png');
      changeImgSrc('bam-logo-alt', 'https://i.imgur.com/Ao4nAG5.png');
    } else {
      changeImgSrc('bam-logo', 'https://i.imgur.com/Ao4nAG5.png');
    }
  };

  const handleCaseStudyNavStyles = () => {
    const positions = h2Text.reduce((obj, h2Str) => {
      const selector = `#${snakeCaseify(h2Str.replace('!', ''))}`;
      const h2 = document.querySelector(selector);
      const position = getScrollPosition() + h2.getBoundingClientRect().top;
      obj[`${selector}-nav`] = position;
      return obj;
    }, {});
    const positionValues = Object.values(positions);
    const positionSelectors = Object.keys(positions);

    positionValues.forEach((_, i) => {
      const li = document.querySelector(positionSelectors[i]);
      const a = li.getElementsByTagName('a')[0];
      const currPosition = i > 0 ? positionValues[i] : 0;
      const nextPositionIdx = i + 1;
      const nextPosition = positionValues[nextPositionIdx] || 999999;

      if (scrollPosition >= currPosition && scrollPosition < nextPosition) {
        highlightSection(li, a);
      } else {
        if (li.getAttribute('style')) li.removeAttribute('style');
        if (a.getAttribute('style')) a.removeAttribute('style');
      }
    });
  };

  const handleCaseStudyNav = () => {
    const ourTeamPosition = getScrollPosition() + ourTeam.getBoundingClientRect().top;
    const mainPosition = getScrollPosition() + main.getBoundingClientRect().top;
    const withinCaseStudy = scrollPosition >= mainPosition
      && scrollPosition < ourTeamPosition - getWindowHeight();

    if (getWindowHeight() < 500) {
      caseStudyNav.style.display = 'none';
    } else if (withinCaseStudy) {
      caseStudyNav.style.display = 'block';
      handleCaseStudyNavStyles();
    } else {
      caseStudyNav.style.display = 'none';
    }
  };

  const styleNav = (bgColor, textColor, hoverColor, changeLogo) => {
    nav.style.backgroundColor = bgColor;
    navLinks.forEach((link) => {
      link.style.color = textColor;

      link.addEventListener('mouseenter', () => {
        link.style.color = hoverColor;
      });

      link.addEventListener('mouseleave', () => {
        link.style.color = textColor;
      });
    });
    if (changeLogo) $(bamLogo).fadeOut('fast');
  };

  const showNav = () => {
    navVisible = true;
    scrollPosition = getScrollPosition();
    const darkNavStylePosition = getWindowHeight() - 88;
    const onHeader = scrollPosition < darkNavStylePosition;

    if (onHeader) {
      styleNav('#9eba2a', '#282828', '#383838', true);
    } else if (onFooter()) {
      styleNav('#282828', '#9eba2a', '#c3e634', true);
    } else {
      styleNav('#282828', '#9eba2a', '#c3e634');
    }

    $(nav).slideDown('fast');
  };

  const hideNav = () => {
    navVisible = false;
    $(bamLogo).fadeIn('fast');
    $(nav).slideUp('fast');
  };

  bamLogo.addEventListener('click', showNav);
  nav.addEventListener('mouseover', showNav);
  main.addEventListener('mouseenter', hideNav);
  ourTeam.addEventListener('mouseenter', hideNav);
  header.addEventListener('mouseenter', hideNav);
  homeLink.addEventListener('click', hideNav);
  caseStudyLink.addEventListener('click', hideNav);
  ourTeamLink.addEventListener('click', hideNav);

  document.addEventListener('scroll', () => {
    if (!navVisible) {
      changeLogoColors();
      changeBamLogoColor();
      handleCaseStudyNav();
    }
  });

  logoLinks.addEventListener('mouseout', (e) => {
    scrollPosition = getScrollPosition();
    const { id } = e.target;
    const logo = id.split('-')[0];
    const ourTeamPosition = ourTeam.getBoundingClientRect().top;
    const ourTeamOffset = (scrollPosition + ourTeamPosition) - getWindowHeight();
    const logoElement = e.target;
    const logoHeight = logoElement.height;
    const logoTop = +window.getComputedStyle(logoElement).top.replace('px', '');
    const logoOffset = logoHeight + logoTop;

    if (scrollPosition > ourTeamOffset + (getWindowHeight() - logoOffset)) {
      const urlKey = `${logo}Black`;
      changeImgSrc(id, logoUrls[urlKey]);
    }
  });

  hljs.initHighlightingOnLoad();
});
