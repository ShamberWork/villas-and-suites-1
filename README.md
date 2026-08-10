# B2C landing

```bash
b2c-landing-vite check
b2c-landing-vite dev
b2c-landing-vite build
```

Для JS + HTML проект содержит готовые брендовые блоки. Для остальных стеков
создаётся минимальный рабочий блок `welcome`, который можно сразу запустить и
использовать как образец структуры.

Если блоку нужен JavaScript, файл `src/scripts/<block>.js` или
`src/scripts/<block>.ts` экспортирует функцию инициализации по умолчанию.
Builder вызывает её после добавления разметки блока:

```js
export default function init() {
  const block = document.querySelector(".welcome");
  if (!block) return;
}
```
