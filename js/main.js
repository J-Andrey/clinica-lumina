'use strict';

// CADASTRE AQUI APENAS OS CONTATOS OFICIAIS DA CLÍNICA.
// Exemplos de formatos: WhatsApp "5511999998888"; Facebook "https://facebook.com/perfil";
// Instagram "https://instagram.com/perfil"; LinkedIn "https://linkedin.com/company/perfil".
// Deixe vazio até receber os dados reais. Não são publicados perfis inventados.
const CLINICA_REDES = {
  whatsapp: '',
  facebook: '',
  instagram: '',
  linkedin: ''
};

function obterLinkWhatsapp(numero) {
  let digits = String(numero || '').replace(/\D/g, '');
  if (/^\d{10,11}$/.test(digits)) digits = '55' + digits;
  return /^55\d{10,11}$/.test(digits) ? `https://wa.me/${digits}` : '';
}

function obterRedeUrl(nome, valor) {
  if (!valor || !String(valor).trim()) return '';
  const v = String(valor).trim();
  if (nome === 'whatsapp') return obterLinkWhatsapp(v);
  if (nome === 'instagram' && /^@?[a-z0-9._]+$/i.test(v)) {
    return `https://www.instagram.com/${v.replace(/^@/, '')}/`;
  }
  try {
    const u = new URL(v);
    if (u.protocol !== 'https:') return '';
    const dominios = {
      facebook: ['facebook.com', 'fb.com'],
      instagram: ['instagram.com'],
      linkedin: ['linkedin.com']
    };
    if ((dominios[nome] || []).some(domain => u.hostname === domain || u.hostname.endsWith('.' + domain))) {
      return u.href;
    }
  } catch { /* Endereço inválido: permanece inativo. */ }
  return '';
}

const whatsappAgendamento = obterLinkWhatsapp(CLINICA_REDES.whatsapp);
document.querySelectorAll('[data-social]').forEach(anchor => {
  const nome = anchor.dataset.social;
  const url = obterRedeUrl(nome, CLINICA_REDES[nome]);
  if (!url) return;
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.removeAttribute('aria-disabled');
  if (nome === 'whatsapp') anchor.textContent = CLINICA_REDES.whatsapp;
  if (nome === 'facebook') anchor.textContent = url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '');
  if (nome === 'instagram') anchor.textContent = '@' + new URL(url).pathname.split('/').filter(Boolean)[0];
  if (nome === 'linkedin') anchor.textContent = url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '');
});


const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const menuIcon = navToggle?.querySelector('use');

function closeMenu() {
  if (!nav || !navToggle) return;
  nav.classList.remove('nav--open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Abrir menu');
  menuIcon?.setAttribute('href', '#icon-menu');
}

navToggle?.addEventListener('click', () => {
  const opening = !nav.classList.contains('nav--open');
  nav.classList.toggle('nav--open', opening);
  navToggle.setAttribute('aria-expanded', String(opening));
  navToggle.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
  menuIcon?.setAttribute('href', opening ? '#icon-close' : '#icon-menu');
});

nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.querySelectorAll('.nav__link').forEach(item => item.classList.remove('nav__link--active'));
    link.classList.add('nav__link--active');
    closeMenu();
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1020) closeMenu();
});

const dialog = document.querySelector('#appointment-dialog');
let previousFocus = null;

document.querySelectorAll('[data-open-appointment]').forEach(button => {
  button.addEventListener('click', () => {
    if (whatsappAgendamento) {
      window.open(whatsappAgendamento, '_blank', 'noopener,noreferrer');
      return;
    }
    if (!dialog) return;
    previousFocus = document.activeElement;
    dialog.showModal();
  });
});

document.querySelectorAll('[data-close-appointment]').forEach(button => {
  button.addEventListener('click', () => dialog?.close());
});

dialog?.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

dialog?.addEventListener('close', () => previousFocus?.focus?.());

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});
