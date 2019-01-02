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
  const mobileCaseStudyNavUl = document.querySelector('#case-study-mobile ul');

  let navVisible = false;
  const getScrollPosition = () => window.scrollY;
  let scrollPosition = getScrollPosition();
  const getWindowHeight = () => window.innerHeight;
  const getWindowWidth = () => window.innerWidth;

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

  const mobileCaseStudyLinks = [];

  h2Text.forEach((h2TextStr) => {
    const li = document.createElement('li');
    li.id = snakeCaseify(`${h2TextStr.replace('!', '').toLowerCase()}-nav`);
    const a = document.createElement('a');
    a.href = snakeCaseify(`#${h2TextStr.replace('!', '')}`);
    a.textContent = h2TextStr.toUpperCase();

    const li2 = document.createElement('li');
    li2.id = snakeCaseify(`mobile-${h2TextStr.replace('!', '').toLowerCase()}-nav`);
    const a2 = document.createElement('a');
    a2.href = snakeCaseify(`#${h2TextStr.replace('!', '')}`);
    a2.textContent = h2TextStr.toUpperCase();

    li.appendChild(a);
    caseStudyNavUl.appendChild(li);

    mobileCaseStudyLinks.push(a2);
    li2.appendChild(a2);
    mobileCaseStudyNavUl.appendChild(li2);
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

  const onHeader = () => {
    scrollPosition = getScrollPosition();
    const darkNavStylePosition = getWindowHeight() - 88;
    return scrollPosition < darkNavStylePosition;   
  }

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
    const mobileCaseStudyNav = document.querySelector('#case-study-mobile');

    positionValues.forEach((_, i) => {
      const li = document.querySelector(positionSelectors[i]);      
      const a = li.getElementsByTagName('a')[0];
      const currPosition = i > 0 ? positionValues[i] : 0;
      const nextPositionIdx = i + 1;
      const nextPosition = positionValues[nextPositionIdx] || 999999;

      if (scrollPosition >= currPosition && scrollPosition < nextPosition && !mobileCaseStudyNav.contains(li)) {
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

    if (getWindowHeight() < 500 || getWindowWidth() < 1100) {     
      caseStudyNav.style.display = 'none';
    } else if (withinCaseStudy) {
      caseStudyNav.style.display = 'block';
      handleCaseStudyNavStyles();
    } else {
      caseStudyNav.style.display = 'none';
    }
  };
//------------------------------------------------------------------------------------------
  const styleNav = (bgColor, textColor, hoverColor) => {
    nav.style.backgroundColor = bgColor;
    const links = Array.prototype.slice.call(navLinks).concat(mobileCaseStudyLinks);
    links.forEach((link) => {
      link.style.color = textColor;

      link.addEventListener('mouseenter', () => {
        link.style.color = hoverColor;
      });

      link.addEventListener('mouseleave', () => {
        link.style.color = textColor;
      });
    });
  };

  const showNav = () => {
    navVisible = true;
    $(nav).slideDown('fast');
    handleNavAndBamLogo();
  };

  const hideNav = () => {
    navVisible = false;
    $(nav).slideUp('fast');
    handleNavAndBamLogo();
  };

  const handleNavAndBamLogo = () => {
    const main = !(onHeader() || onFooter());
    const big = getWindowWidth() > 768;
    const nav = navVisible;

    if (big && !main && nav) {
      changeImgSrc('bam-logo', 'https://i.imgur.com/798Mohw.png'); // black
      styleNav('#9eba2a', '#282828', '#383838');
    } else {
      changeImgSrc('bam-logo', 'https://i.imgur.com/Ao4nAG5.png'); // color
      styleNav('#282828', '#9eba2a', '#c3e634');
    }
  }


//----------------------------------------------------------------------------
  const toggleNav = () => {
    navVisible ? hideNav() : showNav();
  }

  bamLogo.addEventListener('click', toggleNav);
  nav.addEventListener('mouseover', showNav);
  main.addEventListener('mouseenter', hideNav);
  ourTeam.addEventListener('mouseenter', hideNav);
  header.addEventListener('mouseenter', hideNav);
  homeLink.addEventListener('click', hideNav);
  caseStudyLink.addEventListener('click', hideNav);
  mobileCaseStudyLinks.forEach(link => link.addEventListener('click', hideNav));
  ourTeamLink.addEventListener('click', hideNav);

  document.addEventListener('scroll', () => {
    changeLogoColors();
    handleCaseStudyNav();
    handleNavAndBamLogo();
  });

  window.addEventListener('resize', (e) => {
    handleCaseStudyNav();
    if (navVisible) {
      showNav();
    }
    handleNavAndBamLogo();
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
