// Hero CTA button
const ctaButton = document.querySelector('.cta-button');

ctaButton.addEventListener('click', () => {
    document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
});
