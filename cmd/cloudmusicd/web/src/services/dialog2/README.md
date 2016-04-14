实现一个dialog的关键步骤:
1.禁用滚动
2.添加mask
3.点击mask(背景)关闭 
  以上3者在backdrop.component中实现
 
4.参数可配  dialog-config
5.enter/leave动画
6.自己实现的dialog本身只是一个引子,它负责在指定DOM节点处将实际需要弹出的Component (dialog-basic)生成出来
  并添加到DOM树中,为了方便管理,由于dialog本身只是一个injector,所以应该实现一个"代表"它的
  container (dialog-container).并在此container中”指出“实现弹出的component所在的位置(DialogContent)。
  而用以管理这整个结构的则由DialogRef实现.
 