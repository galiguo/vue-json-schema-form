/*
 * @Author: zhanganqi01
 * @Date: 2024-07-09 15:59:32
 * @LastEditTime: 2024-07-09 16:00:48
 * @FilePath: /configured-fe/postcss.config.js
 * @Description: 解决外部css引入报错
 */

module.exports = {  
  plugins: {  
    'autoprefixer': {browsers: 'last 5 version'}  
  } 
}