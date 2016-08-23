# Start_Kit

Starter Kit is boilerplate for web development.

##Key features:
- All scripts in src/js/src are compailing to ES5 on the fly. Watch task refresh server everytime you are saving file.
- CSS file is updating everytime you change the SASS files.
- Custom SASS files are integrated with boostrap 4 files. Custom variables and styles are overwriting boostrap deafult files.

##Instruction

To install all dependecies run a command:

`npm install`

To set babel to work with ES6 run a command:

`npm install --save-dev babel-preset-es2015`

To start watching the files in src folder just run:

`gulp`

To compile, minify and build production-ready files run a command:

`gulp build`
