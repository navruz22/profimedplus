// Adver
export const checkAdver = (adver) => {
  if (!adver.clinica)
    return {
      title: "Diqqat! Avtorizatsiyadan o'tilmagan.",
      description: "Iltimos bo'limdan chiqib qayta kiriting.",
      status: 'error',
    }
  if (!adver.name)
    return {
      title: "Diqqat! Bo'lim nomi kiritilmagan.",
      description: 'Iltimos reklama nomini kiriting.',
      status: 'error',
    }
  return false
}

export const checkStatus = (adver) => {
  if (!adver.clinica)
    return {
      title: "Diqqat! Avtorizatsiyadan o'tilmagan.",
      description: "Iltimos bo'limdan chiqib qayta kiriting.",
      status: 'error',
    }
  if (!adver.name)
    return {
      title: "Diqqat! Status nomi kiritilmagan.",
      description: 'Iltimos status nomini kiriting.',
      status: 'error',
    }
  return false
}