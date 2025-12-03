
import { TranslationDictionary } from './types';

export const ru: TranslationDictionary = {
  header: {
    title: "ВекторКрафт ИИ",
    subtitle: "На базе Gemini 3 Pro",
    docs: "Документация",
  },
  tabs: {
    create: "Генезис (Создать)",
    transform: "Реконструкция (Изменить)",
  },
  hero: {
    title: "Что мы будем создавать?",
    subtitle: "Опишите объект, задайте стиль, и мы спроектируем векторную графику.",
    titleTransform: "Улучшение и Анимация",
    subtitleTransform: "Загрузите SVG для модернизации логики, стиля или добавления движения.",
  },
  inputs: {
    sourceSvgLabel: "Исходный код SVG / Файл",
    sourceSvgPlaceholder: "Вставьте код SVG или загрузите файл...",
    objectLabel: "Описание объекта",
    objectPlaceholder: "например, Футуристический шлем...",
    transformLabel: "Цели трансформации",
    transformPlaceholder: "например, Сделать линии толще, изменить цвета на золото...",
    styleLabel: "Визуальный стиль",
    stylePlaceholder: "например, Плоский дизайн, неон...",
    techLabel: "Функционал и Анимация",
    techPlaceholder: "например, Вращать шестеренку, добавить эффект свечения при наведении...",
    resolutionLabel: "Разрешение холста",
    customRes: "Свой размер",
    urlsLabel: "Ссылки на референсы",
    urlsPlaceholder: "https://...",
    intelligenceLabel: "Интеллект",
    searchLabel: "Поиск Google",
    dropzoneDefault: "Перетащите SVG/фото, Ctrl+V",
    dropzoneDragging: "Отпустите файлы",
    pasteLabel: "Вставить из буфера",
    addOptions: "Тех. параметры",
    hideOptions: "Скрыть параметры",
    generateButton: "Сгенерировать",
    transformButton: "Трансформировать",
    generatingButton: "Обработка...",
  },
  preview: {
    resultTitle: "Результат",
    copyTooltip: "Копировать код SVG",
    downloadButton: "Экспорт",
    downloadSvg: "Скачать SVG",
    downloadPng: "Скачать PNG",
    downloadZip: "Скачать ZIP (Всё)",
    generatedBy: "Сгенерировано Gemini 3 Pro",
    emptyStateTitle: "Ожидание ввода",
    emptyStateDesc: "Сгенерированное изображение появится здесь",
    emptyStateDescShort: "Область просмотра",
    bgDark: "Тёмный",
    bgLight: "Светлый",
    bgGrid: "Сетка"
  },
  history: {
    title: "Журнал Производства",
    empty: "История производства пуста.",
    restore: "Восстановить",
    delete: "Удалить",
    clearAll: "Очистить журнал"
  },
  refine: {
    label: "Диалектическое Снятие (Aufhebung)",
    placeholder: "Какие противоречия устранить? (напр., сгладить углы)",
    button: "Синтез",
    processing: "Снятие...",
  },
  errors: {
    generationFailed: "Ошибка генерации",
    defaultDetails: "Произошла непредвиденная ошибка при связи с Gemini.",
  },
  suggestions: {
    camera: 'Ретро камера',
    rocket: 'Космическая ракета',
    bird: 'Птица оригами',
    house: 'Изометрический дом'
  }
};
