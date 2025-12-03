
import { TranslationDictionary } from './types';

export const es: TranslationDictionary = {
  header: {
    title: "VectorCraft AI",
    subtitle: "Impulsado por Gemini 3 Pro",
    docs: "Documentación",
  },
  tabs: {
    create: "Génesis (Crear)",
    transform: "Reconstrucción (Editar)",
  },
  hero: {
    title: "¿Qué quieres crear?",
    subtitle: "Describe un objeto, define el estilo y diseñaremos el arte vectorial.",
    titleTransform: "Refinar y Animar",
    subtitleTransform: "Sube un SVG existente para mejorar su lógica, estilo o movimiento.",
  },
  inputs: {
    sourceSvgLabel: "Código SVG fuente / Archivo",
    sourceSvgPlaceholder: "Pega el código SVG o sube un archivo...",
    objectLabel: "Descripción del objeto",
    objectPlaceholder: "ej. Un casco futurista...",
    transformLabel: "Objetivos de transformación",
    transformPlaceholder: "ej. Cambiar colores a dorado, engrosar líneas...",
    styleLabel: "Estilo visual",
    stylePlaceholder: "ej. Diseño plano, neón...",
    techLabel: "Especificaciones y Animación",
    techPlaceholder: "ej. Rotar el engranaje, efecto de brillo al pasar el mouse...",
    resolutionLabel: "Resolución del lienzo",
    customRes: "Personalizado",
    urlsLabel: "URLs de referencia",
    urlsPlaceholder: "https://...",
    intelligenceLabel: "Inteligencia",
    searchLabel: "Búsqueda de Google",
    dropzoneDefault: "Arrastra SVG/img, Ctrl+V",
    dropzoneDragging: "Suelta para adjuntar",
    pasteLabel: "Pegar portapapeles",
    addOptions: "Especificaciones",
    hideOptions: "Ocultar especificaciones",
    generateButton: "Generar",
    transformButton: "Transformar",
    generatingButton: "Procesando...",
  },
  preview: {
    resultTitle: "Resultado",
    copyTooltip: "Copiar código SVG",
    downloadButton: "Exportar",
    downloadSvg: "Descargar SVG",
    downloadPng: "Descargar PNG",
    downloadZip: "Descargar ZIP (Todo)",
    generatedBy: "Generado por Gemini 3 Pro",
    emptyStateTitle: "Esperando entrada",
    emptyStateDesc: "El arte generado aparecerá aquí",
    emptyStateDescShort: "Área de arte",
    bgDark: "Oscuro",
    bgLight: "Claro",
    bgGrid: "Cuadrícula"
  },
  history: {
    title: "Registro de Producción",
    empty: "Historial vacío.",
    restore: "Restaurar",
    delete: "Borrar",
    clearAll: "Limpiar todo"
  },
  refine: {
    label: "Superación Dialéctica (Aufhebung)",
    placeholder: "¿Qué contradicciones resolver?",
    button: "Síntesis",
    processing: "Procesando...",
  },
  errors: {
    generationFailed: "Fallo en la generación",
    defaultDetails: "Ocurrió un error inesperado al contactar con Gemini.",
  },
  suggestions: {
    camera: 'Cámara retro',
    rocket: 'Cohete espacial',
    bird: 'Pájaro de origami',
    house: 'Casa isométrica'
  }
};
