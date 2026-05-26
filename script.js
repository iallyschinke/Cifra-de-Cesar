// Referências aos elementos HTML usados no script
const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const shiftValue = document.getElementById("shiftValue");
const copyButton = document.getElementById("copyButton");
const resetButton = document.getElementById("resetButton");
const modeRadios = document.querySelectorAll('input[name="mode"]');

// Conjunto de alfabetos suportados pela aplicação
const alphabets = {
  latin: "abcdefghijklmnopqrstuvwxyz",
};

// Obtém o modo selecionado: "encode" ou "decode"
function getSelectedMode() {
  return document.querySelector('input[name="mode"]:checked').value;
}

// Normaliza o valor do deslocamento para um número válido
function normalizeValue(value) {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
}

// Aplica a Cifra de César no texto informado
function transformText(text, shift, mode) {
  const alphabet = alphabets.latin;
  const maxIndex = alphabet.length;
  const direction = mode === "decode" ? -1 : 1;
  const offset = ((shift % maxIndex) + maxIndex) % maxIndex;

  return text
    .split("")
    .map((char) => {
      const lower = char.toLowerCase();
      const idx = alphabet.indexOf(lower);

      // Retorna o próprio caractere se não fizer parte do alfabeto
      if (idx === -1) {
        return char;
      }

      // Calcula a nova posição dentro do alfabeto
      const newIndex = (idx + direction * offset + maxIndex) % maxIndex;
      const transformed = alphabet[newIndex];

      // Preserva maiúsculas e minúsculas
      return char === lower ? transformed : transformed.toUpperCase();
    })
    .join("");
}

// Atualiza o texto de resultado com base na entrada atual
function updateResult() {
  const text = inputText.value;
  const shift = normalizeValue(shiftValue.value);
  const mode = getSelectedMode();

  outputText.textContent =
    transformText(text, shift, mode) ||
    "Digite um texto para ver o resultado aqui.";
}

// Copia o resultado para a área de transferência
function copyResult() {
  const result = outputText.textContent;
  if (!result) return;

  navigator.clipboard
    .writeText(result)
    .then(() => {
      copyButton.textContent = "Copiado";
      setTimeout(() => {
        copyButton.textContent = "Copiar";
      }, 1200);
    })
    .catch(() => {
      copyButton.textContent = "Erro";
      setTimeout(() => {
        copyButton.textContent = "Copiar";
      }, 1200);
    });
}

// Redefine o formulário para o estado inicial
function resetForm() {
  inputText.value = "";
  shiftValue.value = "2";
  modeRadios[0].checked = true;
  updateResult();
}

// Eventos de interação do usuário
inputText.addEventListener("input", updateResult);
shiftValue.addEventListener("input", updateResult);
modeRadios.forEach((radio) => radio.addEventListener("change", updateResult));
copyButton.addEventListener("click", copyResult);
resetButton.addEventListener("click", resetForm);

// Executa a primeira renderização do resultado
updateResult();
