注意事项:

1. 如果编译不正确请检查tsconfig.json中的编译选项是commonjs还是system或者其他.

2. 如果出现类似于require未定义错误,请注意System.Config中的Module配置是register还是其他.

3. 如果出现xxx找不到情况,请注意设置System.Config中的map项.

4. 如果使用了特定于Node的模块,则需要使用browserify 转换.

5. 在使用browserify转换时注意-s参数的使用.

6. 在转换时的顺序是: tsc ->browserify/watchify ->uglify