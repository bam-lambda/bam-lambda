/* global document */
document.addEventListener('DOMContentLoaded', () => {
  const bamLogo = document.querySelector('#bam-logo');
  const nav = document.querySelector('nav');
  const main = document.querySelector('main');
  const closeNav = document.querySelector('#close-nav');
  const homeLink = document.querySelector('#home-link');
  const caseStudyLink = document.querySelector('#case-study-link');
  // const ourTeam = document.querySelector('#our-team');

  const showNav = () => {
    nav.style.display = 'block';
    main.style.display = 'none';
  };

  const hideNav = () => {
    nav.style.display = 'none';
    main.style.display = 'block';
  };

  bamLogo.addEventListener('click', showNav);
  closeNav.addEventListener('click', hideNav);
  homeLink.addEventListener('click', hideNav);
  caseStudyLink.addEventListener('click', hideNav);
  // ourTeamLink.addEventListener('click', hideNav);
});
