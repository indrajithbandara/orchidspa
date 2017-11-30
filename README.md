### Editing guide

It will be probably not necessary but you can use Markdown to format all text. Markdown is quite simple, here are some tutorial:

- Intro [to markdown](https://gist.github.com/budparr/9257428)
- Basic [markdown tutorial](https://help.github.com/articles/basic-writing-and-formatting-syntax/)
- Quick reference and showcase [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)


#### Home page

To edit the intro text in the home page, [go here](https://github.com/toybreaker/orchidspa/tree/source/_includes/editables)

To have a product displayed in the home page set the field ```featured: true```.


#### Company infos

Edit the proper line, from line 15 to line 40, in the [config.yml](https://github.com/toybreaker/orchidspa/blob/source/_config.yml)


#### Products

Products are organized in [folders](https://github.com/toybreaker/orchidspa/tree/source/_products):
- [Service](https://github.com/toybreaker/orchidspa/tree/source/_products/service)
- [Hot deal](https://github.com/toybreaker/orchidspa/tree/source/_products/hotdeal)
- [Package](https://github.com/toybreaker/orchidspa/tree/source/_products/package)

To create a new product add a file in the proper folder. For example if you want to create a new service product called ```porridge massage```. Add a file named ```porridge-massage.md``` inside the [Service](https://github.com/toybreaker/orchidspa/tree/source/_products/service) folder. Copy from an existing product to be sure you have all necessary infos in the ["front matter"](https://jekyllrb.com/docs/frontmatter/) section of the new product. The image for this product needs to be a minimum of 535x357px, if bigger it still needs to have the same proportions as 535x357px. It needs to be named exactly like the text file so ```porridge-massage.jpg```. You have to put it [/assets/p/products/service/](https://github.com/toybreaker/orchidspa/tree/source/assets/p/products/service) an the system will take care of it.
The ```button_book_link: ...``` field need to match the id number in the eazyengine backend. If you want it to appear in the home page set ```featured: true```. If you want it to display a "new" flag set ```tag: new```. At this point its all done. It will now appear in the ```service``` page (in alphabetical order) and also in the footer menu.

#### Gallery

To add or remove gallery photos add it or remove it [here](https://github.com/toybreaker/orchidspa/tree/source/assets/p/gallery). Pictures need to be 1680x1120px exactly.


#### Home page slideshow

To add or remove home slideshow photos add it or remove it [here](https://github.com/toybreaker/orchidspa/tree/source/assets/p/home). Pictures need to be 1680x1120px exactly.

## Warning:

Despite this repo being public, it doesn't mean that all these assets are open-source and/or copyright free, or even that you may use any of them. Please, ask for permission first by contacting us: info@junglestar.org  

All photos are © by the photographers, all rights are reserved.  

Thanks, the [Junglestar](http://junglestar.org) team.
