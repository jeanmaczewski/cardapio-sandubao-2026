// ── Seleção dos elementos ──────────────────────────
const campoNome = document.getElementById('name');
const campoCpf = document.getElementById('cpf');
const campoEmail = document.getElementById('email');
const campoTelefone = document.getElementById('phone');
const formulario = document.querySelector('.form-cadastro');

// ── Máscara de CPF ──────────────────────────────────
campoCpf.addEventListener('input', () => {
  let valor = campoCpf.value.replace(/\D/g, '');
  valor = valor.slice(0, 11);

  if (valor.length > 9) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  } else if (valor.length > 6) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  } else if (valor.length > 3) {
    valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  }

  campoCpf.value = valor;
});

// ── Máscara de telefone ─────────────────────────────
campoTelefone.addEventListener('input', () => {
  let valor = campoTelefone.value.replace(/\D/g, '');
  valor = valor.slice(0, 11);

  if (valor.length > 6) {
    valor = valor.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  } else if (valor.length > 2) {
    valor = valor.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  } else if (valor.length > 0) {
    valor = valor.replace(/(\d{0,2})/, '($1');
  }

  campoTelefone.value = valor;
});

// ── Validação matemática de CPF (dígitos verificadores) ──
function validarDigitosCpf(cpf) {
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;

  return true;
}

// ── Função reutilizável para mostrar/remover erro ────
function mostrarErro(campo, valido, mensagem) {
  const grupo = campo.closest('.form-group');
  let aviso = grupo.querySelector('.form-erro');

  if (!valido) {
    if (!aviso) {
      aviso = document.createElement('span');
      aviso.className = 'form-erro';
      grupo.appendChild(aviso);
    }
    aviso.textContent = mensagem;
  } else if (aviso) {
    aviso.remove();
  }

  return valido;
}

//Mensagem de Validação do Cadastro

function mostrarSucesso() {
  const mensagem = document.createElement('div');
  mensagem.className = 'form-sucesso';
  mensagem.textContent =
    'Cadastro enviado com sucesso! Bem-vindo à família Sandubão.';

  formulario.parentElement.insertBefore(mensagem, formulario);

  setTimeout(() => {
    mensagem.remove();
  }, 4000);
}

// ── Validação no envio ──────────────────────────────
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const regexNome = /^[a-zA-ZÀ-ÿ]{2,}(\s[a-zA-ZÀ-ÿ]{2,})+$/;
  const nomeValido = regexNome.test(campoNome.value.trim());
  mostrarErro(campoNome, nomeValido, 'Digite nome e sobrenome');

  const numerosCpf = campoCpf.value.replace(/\D/g, '');
  const cpfValido = numerosCpf.length === 11 && validarDigitosCpf(numerosCpf);
  mostrarErro(campoCpf, cpfValido, 'CPF inválido');

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValido = regexEmail.test(campoEmail.value.trim());
  mostrarErro(campoEmail, emailValido, 'Digite um e-mail válido');

  const numerosTelefone = campoTelefone.value.replace(/\D/g, '');
  const telefoneValido =
    numerosTelefone.length === 10 || numerosTelefone.length === 11;
  mostrarErro(
    campoTelefone,
    telefoneValido,
    'Telefone deve ter DDD + número (10 ou 11 dígitos)'
  );

  if (nomeValido && cpfValido && emailValido && telefoneValido) {
    mostrarSucesso();
    formulario.reset();
  }
});
