// OCULTO - Sistema original estático
// import { en } from '../../public/locales/en'
// const T = en
// export default T

// ✅ DOCOOLTURE - Re-exporta el hook para compatibilidad
// Para componentes CLIENT: usar useLanguage() del LanguageContext
// Para componentes SERVER: usar el locale por defecto (es)
import { es } from '../../public/locales/es'
export default es
