
### flux 包实现了react的flux结构,此结构有以下几个注意的地方:

1. action creator 只是一个方便使用的helper,如果不存在，不影响使用
2. 这个结构的关键点在于数据的one-binding.
3. 此架构的boot有先后顺序: 
    1. 最先启动的是dispatcher.因为store要向之注册它可以处理的action.
    2. 其次启动的是store,它用来保存数据及接受数据的更新,并向所有关注了相关event的view广播更新
    3. 再次启用的是action creator用以 通知更新action.
    4. 最后是更新的发起者及接收者,它将注册它所希望被通知的事件类型.
4. 假设有一个来自view更新操作,它将数据通过action creator封装成action,然后通过dispatcher分发到相应的store(即store可以有多个,每个store只关注自己感兴趣的action),store在完成数据更新后,广播更新操作, 相应的view接受到更新通知,然后**主动**从store 拉取数据及更新view.

5. 因为上面的第3步,所以在flux下实现了一个flux-boot的服务,此服务在app中注册,以达到启动顺序正确。

6. ps:
    1. http://victorsavkin.com/post/99998937651/building-angular-apps-using-flux-architecture
    2. http://facebook.github.io/flux/docs/overview.html#content
    3. https://github.com/facebook/flux