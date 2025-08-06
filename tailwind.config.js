module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFC107', // 主色调：明亮的黄色，可爱风格常用的活泼色彩
        secondary: '#FF8A65', // 辅助色：柔和的粉色，增加可爱感
        neutral: {
          100: '#FDE0DD', // 更浅的粉色系，用于背景等元素，营造柔和氛围
          200: '#FAD4C0',
          300: '#F8B495',
          400: '#EF9A9A',
          500: '#E57373',
          600: '#EF5350',
          700: '#E53935',
          800: '#D32F2F',
          900: '#C62828',
        },
        cutePink: '#FFD1DC', // 新增可爱粉色，用于点缀元素
        cuteBlue: '#81D4FA', // 新增可爱蓝色，用于一些装饰元素
        cuteGreen: '#A5D6A7', // 新增可爱绿色，用于突出积极元素（比如优惠等）
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'large-round': '20px', // 定义更大的圆角值，用于营造可爱圆润效果
        'extra-round': '50%', // 完全圆形的角，用于一些图标等元素
      },
    },
  },
  plugins: [],
}