const dialogPolyfillURL = "https://esm.run/dialog-polyfill";
const isBrowserNotSupportDialog = window.HTMLDialogElement === undefined;
if (isBrowserNotSupportDialog) {
  const dialogs = document.querySelectorAll("dialog");

  dialogs.forEach(async (dialog) => {
    const {default: polyfill} = await import(dialogPolyfillURL);
    polyfill.registerDialog(dialog);
  });
}

const buttonOpenModal = document.querySelector('.button-open-modal')
const modal = document.querySelector('.modal')
const buttonCloseModal = document.querySelector('.modal__close-button')
const form = document.querySelector('#reg-form')
const buttonSubmit = document.querySelector('.modal__button-submit')

const handleButtonOpenModalClick = () => {
  modal.showModal()
  // console.log(modal.open)
}

const handleBackdropClick = ({target, currentTarget}) => {
  const dialogElement = currentTarget
  const isClickOnBackdrop = target === dialogElement
  if (isClickOnBackdrop) {
    dialogElement.close()
    form.reset()
    clearValidityStyles()
    buttonSubmit.disabled = true

  }
}

const handleCloseModalButton = () => {
  modal.close()
  form.reset()
  clearValidityStyles()
  buttonSubmit.disabled = true

}

const handleSubmitButton = (e) => {
  e.preventDefault()
  console.log(JSON.stringify({
    email: serializeForm(form).email.value,
    nickname: serializeForm(form).nickname.value,
    password: serializeForm(form).password.value,
    passwordAgain: serializeForm(form).passwordAgain.value,
    contract: serializeForm(form).contract.value,
  }))
}

buttonOpenModal.addEventListener('click', handleButtonOpenModalClick)

modal.addEventListener('click', handleBackdropClick)

buttonCloseModal.addEventListener('click', handleCloseModalButton)

buttonSubmit.addEventListener('click', handleSubmitButton)

form.addEventListener('input', checkFormValidity)


const serializeForm = (formNode) => {
  const formElements = formNode.elements

  return {
    email: {
      value: formElements.email.value,
      node: formElements.email,
    },
    nickname: {
      value: formElements.nickname.value,
      node: formElements.nickname,
    },
    password: {
      value: formElements.password.value,
      node: formElements.password,
    },
    passwordAgain: {
      value: formElements.passwordAgain.value,
      node: formElements.passwordAgain,
    },
    contract: {
      value: formElements.contract.checked,
      node: formElements.contract,
    },
  }
}

const serializedForm = serializeForm(form)

function clearValidityStyles () {
  const validInLengthNode = document.querySelector('#validPasswordLengthImg')
  const validInNumberContainNode = document.querySelector('#validPasswordInNumberContain')
  const validInWordCaseNode = document.querySelector('#validPasswordInWordCase')
  const validPasswordMatchesNickNode = document.querySelector('#validPasswordMatchesNick')
  const validPasswordAgainMessageNode = document.querySelector('#validPasswordAgainMessage')

  validInLengthNode.classList.remove('font-red', 'font-green', 'modal__circle--error', 'modal__circle--ok')
  validInNumberContainNode.classList.remove('font-red', 'font-green', 'modal__circle--error', 'modal__circle--ok')
  validInWordCaseNode.classList.remove('font-red', 'font-green', 'modal__circle--error', 'modal__circle--ok')
  validPasswordMatchesNickNode.classList.remove('font-red', 'font-green')
  validPasswordAgainMessageNode.classList.remove('font-red', 'font-green')
  serializedForm.email.node.classList.remove('modal__input--invalid')
  serializedForm.nickname.node.classList.remove('modal__input--invalid')
  serializedForm.password.node.classList.remove('modal__input--invalid')
  serializedForm.passwordAgain.node.classList.remove('modal__input--invalid')
}

const customValidityNickname = (value) => {
  const regexp = /^[a-zA-z][A-Za-z0-9_]{3,39}$/gi

  return regexp.test(value)
}

const showValidityStylesForPassword = (value) => {
  const isValidLength = 6 <= value.length && value.length <= 32
  const isValidNumberContain = /[0-9]/g.test(value)
  const isValidLowerCase = /[a-z]/g.test(value)
  const isValidUpperCase = /[A-Z]/g.test(value)
  const isValidWordCase = isValidLowerCase && isValidUpperCase

  const nicknameValue = form.elements.nickname.value.trim()
  const emailValue = form.elements.email.value.trim()
  const isValidMatchesNicknameOrEmail = value === nicknameValue || value === emailValue
  const invalidTextClassName = 'font-red'

  const validInLengthNode = document.querySelector('#validPasswordLengthImg')
  const validInNumberContainNode = document.querySelector('#validPasswordInNumberContain')
  const validInWordCaseNode = document.querySelector('#validPasswordInWordCase')
  const validPasswordMatchesNickNode = document.querySelector('#validPasswordMatchesNick')

  addOrRemoveValidityClassNames(validInLengthNode, isValidLength)
  addOrRemoveValidityClassNames(validInNumberContainNode, isValidNumberContain)
  addOrRemoveValidityClassNames(validInWordCaseNode, isValidWordCase)
  addOrRemoveConditionallyThisClass(validPasswordMatchesNickNode, !isValidMatchesNicknameOrEmail, invalidTextClassName)
}

const customValidityPassword = (value) => {
  const isValidLength = 6 <= value.length && value.length <= 32
  const isValidNumberContain = /[0-9]/g.test(value)
  const isValidLowerCase = /[a-z]/g.test(value)
  const isValidUpperCase = /[A-Z]/g.test(value)
  const isValidWordCase = isValidLowerCase && isValidUpperCase

  const nicknameValue = form.elements.nickname.value.trim()
  const emailValue = form.elements.email.value.trim()
  const isValidMatchesNicknameOrEmail = value === nicknameValue || value === emailValue

  const resultValidityPassword = isValidLength && isValidNumberContain && isValidWordCase && !isValidMatchesNicknameOrEmail

  return resultValidityPassword
}

const showValidityPasswordAgainStylesMessage = (valuePwAgain, valuePw) => {
  const validPasswordAgainMessageNode = document.querySelector('#validPasswordAgainMessage')
  const isValidFieldPasswordAgain = valuePwAgain.trim() === valuePw.trim()
  const invalidTextClassName = 'font-red'

  addOrRemoveConditionallyThisClass(validPasswordAgainMessageNode, isValidFieldPasswordAgain, invalidTextClassName)
}

const customValidityPasswordAgain = (valuePwAgain, valuePw) => {
  const isValidFieldPasswordAgain = valuePwAgain.trim() === valuePw.trim()
  return isValidFieldPasswordAgain
}

const addOrRemoveInvalidityClassForInput = (fieldNode, isValid) => {
  if (!isValid) {
    fieldNode.classList.add('modal__input--invalid')
  } else {
    fieldNode.classList.remove('modal__input--invalid')
  }
}

const addOrRemoveConditionallyThisClass = (fieldNode, isValid, className) => {
  if (!isValid) {
    fieldNode.classList.add(className)
  } else {
    fieldNode.classList.remove(className)
  }
}

const addOrRemoveValidityClassNames = (fieldNode, isValid) => {
  if (!isValid) {
    fieldNode.classList.remove('modal__circle--ok', 'font-green')
    fieldNode.classList.add('modal__circle--error', 'font-red')
  } else {
    fieldNode.classList.remove('modal__circle--error', 'font-red')
    fieldNode.classList.add('modal__circle--ok', 'font-green')
  }
}

const handleNicknameInput = (e) => {
  const isCustomValidNickname = customValidityNickname(e.target.value)
  addOrRemoveInvalidityClassForInput(serializedForm.nickname.node, isCustomValidNickname)
}

serializedForm.nickname.node.addEventListener('input', handleNicknameInput)

const handleEmailInput = (e) => {
  const isValidEmail = serializedForm.email.node.validity.valid
  addOrRemoveInvalidityClassForInput(serializedForm.email.node, isValidEmail)
}

serializedForm.email.node.addEventListener('input', handleEmailInput)

const handlePasswordInput = (e) => {
  const isCustomValidPassword = customValidityPassword(e.target.value)
  addOrRemoveInvalidityClassForInput(serializedForm.password.node, isCustomValidPassword)
  showValidityStylesForPassword(e.target.value)

  const passwordAgainValue = form.elements.passwordAgain.value.trim()

  if (passwordAgainValue !== '') {
    const isCustomValidPasswordAgain = customValidityPasswordAgain(passwordAgainValue, e.target.value)
    addOrRemoveInvalidityClassForInput(serializedForm.passwordAgain.node, isCustomValidPasswordAgain)
    showValidityPasswordAgainStylesMessage(passwordAgainValue, e.target.value)
  }
}

serializedForm.password.node.addEventListener('input', handlePasswordInput)

const handlePasswordAgainInput = (e) => {
  const passwordValue = form.elements.password.value
  const isCustomValidPasswordAgain = customValidityPasswordAgain(e.target.value, passwordValue)

  addOrRemoveInvalidityClassForInput(serializedForm.passwordAgain.node, isCustomValidPasswordAgain)
  showValidityPasswordAgainStylesMessage(e.target.value, passwordValue)
}

serializedForm.passwordAgain.node.addEventListener('input', handlePasswordAgainInput)

function checkFormValidity(e) {
  const formNode = e.target.form
  const isValid = formNode.checkValidity()
  const serializedForm = serializeForm(formNode)

  const isCustomValidNickname = customValidityNickname(serializedForm.nickname.value)
  const isValidEmail = serializedForm.email.node.validity.valid
  const isCustomValidPassword = customValidityPassword(serializedForm.password.value)
  const isCustomValidPasswordAgain = customValidityPasswordAgain(serializedForm.passwordAgain.value, serializedForm.password.value)

  buttonSubmit.disabled = !(isValid && isCustomValidNickname && isValidEmail && isCustomValidPassword && isCustomValidPasswordAgain)
}
