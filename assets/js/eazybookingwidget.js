var eazyBookingPath = 'https://eazyengine.com/booking';
// sasd
if (typeof jQuery == 'undefined') {
    // jQuery is not loaded
    var jq = document.createElement('script'); jq.type = 'text/javascript';
    jq.src = eazyBookingPath+'/jquery.js';
    document.getElementsByTagName('head')[0].appendChild(jq);
}

var head = document.getElementsByTagName('head')[0];

var facss = document.createElement('link');
facss.rel = 'stylesheet';
facss.type = 'text/css';
facss.href = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'; //eazyBookingPath+'/fontawesome/css/font-awesome.min.css';
head.appendChild(facss);

if(typeof moment == 'undefined'){
    var mmjs = document.createElement('script');
    mmjs.type = 'text/javascript';
    mmjs.src = eazyBookingPath+'/moment.min.js';
    mmjs.defer = true;
    head.appendChild(mmjs);
}

(function(){
    // Poll for jQuery to come into existance
    var checkReady = function(callback) {
        if (window.jQuery) {
            callback(jQuery);
        }
        else {
            window.setTimeout(function() { checkReady(callback); }, 600);
        }
    };


    // function submit_trial(e){
    //     e.preventDefault();
    //
    //     var form = $(this),
    //         postData = form.serialize();
    //
    //     $.ajax({
    //         url : form.attr('action'),
    //         method : form.attr('method'),
    //         data : postData,
    //         dataType:'json',
    //         success : function(result){
    //             if(result.status){
    //
    //             }else{
    //
    //             }
    //         },
    //         error : function(jqxhr, statusText, errorThrown){
    //
    //         }
    //     })
    //
    //     return false;
    // }

    // Start polling...
    checkReady(function($) {

        var bscss = document.createElement('link');
        bscss.rel = 'stylesheet';
        bscss.type = 'text/css';
        bscss.href = eazyBookingPath+'/ezstyle.new.css';
        head.appendChild(bscss);

        var bdcss = document.createElement('link');
        bdcss.rel = 'stylesheet';
        bdcss.type = 'text/css';
        bdcss.href = eazyBookingPath+'/ezdatepicker.css';
        head.appendChild(bdcss);

        if(typeof $().emulateTransitionEnd != 'function'){
            var bsjs = document.createElement('script');
            bsjs.type = 'text/javascript';
            bsjs.src = eazyBookingPath+'/eazy-bootstrap.js';
            bsjs.defer = true;
            head.appendChild(bsjs);
        }

        if(typeof $().datetimepicker != 'function'){
            //head.appendChild(bdcss);

            var bdjs = document.createElement('script');
            bdjs.type = 'text/javascript';
            bdjs.src = eazyBookingPath+'/bootstrap-datetimepicker.min.js';
            bdjs.defer = true;
            head.appendChild(bdjs);
        }

        var opcss = document.createElement('link');
        opcss.rel = 'stylesheet';
        opcss.type = 'text/css';
        opcss.href = eazyBookingPath+'/booking_new.css';
        head.appendChild(opcss);
    });
})();

var packagae_price  = [],
    cart_content    = [],
    book_data       = [],
    treatmentId     = 0,
    token,
    secretKey,
    targetUrl,
    idVendor,
    useBrowserStorage;

var $ = jQuery;

    function deleteBookDataItem(cartItemId){
        $.each(book_data, function(i, element){
            if(element.cartItemId == cartItemId){
                book_data.splice(i, 1);
                return false;
            }
        });

        if(useBrowserStorage){
            localStorage.setItem('enquiry', JSON.stringify(book_data));
            var _date = new Date();
            localStorage.setItem('enquiry_expire', _date);
        }
    }

    function updateBookData(cartItemId, id_product, price, person, date, time){
        var cartItemFound = false;
        $.each(book_data, function(i, element){
            if(element.cartItemId == cartItemId){
                oldPerson = book_data[i].person;
                book_data[i].person = (oldPerson*1)+(person*1);
                cartItemFound = true;
                return false;
            }
        });

        if(!cartItemFound){
            book_data.push({
                cartItemId : cartItemId,
                id_product : id_product,
                price : price,
                person : person,
                date : date,
                time : time
            });
        }
    }

    function getData(params){
        var defParam = {
                    dataType : 'json',
                    type    : 'GET',
                    headers : {
                                Authorization   : 'spadeals ' + secretKey,
                                Tokenization    : token
                    },
                    error   : function(jqXHR, textStatus, errorThrown ){
                        console.log(textStatus + ' : ' + errorThrown);
                    },
            },
            ajaxParams = $.extend({}, defParam, params);

        $.ajax(ajaxParams);
    }

    function putData(params){
        var defParam = {
                    dataType : 'json',
                    type    : 'PUT',
                    headers : {
                                Authorization   : 'spadeals ' + secretKey,
                                Tokenization    : token
                    },
                    error   : function(jqXHR, textStatus, errorThrown ){
                        console.log(textStatus + ' : ' + errorThrown);
                    },
            },
            ajaxParams = $.extend({}, defParam, params);

        $.ajax(ajaxParams);
    }

    function preloader(target, mode){

        var height  = $(target).height()+30,
            width   = $(target).width()+30,
            padding_top = 200,
            preload =   '<div id="prelaoder-crts" style="height:'+height+'px;width:'+width+'px;padding-top:'+padding_top+'px;">'+
                        '<center>'+
                            '<div id="loader-wrapper"><div id="loader"></div></div>' +
                            'Please wait...'+
                        '</center>'+
                    '</div>';

        if(mode == 'show'){
            $(target).append(preload);
        }else{
            $(target).find('#prelaoder-crts').remove();
        }
    }

    function showCartItem(){
        var items = 'nolocalitems',
            itemJSON,
            processedProduct = [],
            jmlPackage = 0,
            price = 0;
        if(useBrowserStorage){
            itemJSON = localStorage.getItem('enquiry');
            items = JSON.parse(itemJSON);
            console.log(items);
        }
        //console.log(items);
        if(items!='nolocalitems'){
            jmlPackage = items.length;

            if(jmlPackage !== 0){
                if(jmlPackage>1){
                    jmlPackage += ' items';
                }else{
                    jmlPackage += ' item';
                }
                jmlPackage = 'View Cart | '+jmlPackage;
            }else{
                jmlPackage = 'View Cart';
            }
            $('#ezcartitem').html(jmlPackage);
        }
    }


    function loadsetPackage(){
        var option_package = '<option value="0">Select Treatment</option>',
            product = $('#eazy-select-package'),
            datePicker = $('#eazy-select-date'),
            timePicker = $('#eazy-select-time'),
            personPicker = $('#eazy-select-person'),
            submitButton = $('#submit-book'),
            selectedValue = "";

        getData({
            url: targetUrl +'/api/products.php?loadpackage',
            data : {group : 'category' },
            beforeSend : function(e){
                preloader('#ezmodal-body-'+idVendor, 'show');
            },
            success : function(result){
                var _set = '';
                $.each(result, function (package_group, package_item){
                    option_package += '<optgroup label="'+package_group+'">';
                    $.each(package_item, function(ix, vx){
                        if(typeof treatmentId!= 'undefined' && !isNaN(parseFloat(treatmentId)) && isFinite(treatmentId) && treatmentId==vx.id_product){
                            selectedValue = "selected";
                            _set = "selected";
                        }else{
                            selectedValue = "";
                        }
                        option_package += '<option value="'+ix+'" data-price="'+vx.product_price+'" data-lang="'+vx.product_lang+'" '+selectedValue+'>'+vx.product_title+'</option>';
                    });
                    option_package += '</optgroup>';
                });
                product.html(option_package);

                $('#submit-book').prop('disabled', true);
                $('#eazy-select-date').datetimepicker({
                    format: 'YYYY-MM-DD',
                    useCurrent: false,
                    minDate: moment(),
                    debug : true
                });
                //---------------------------------------------------------
                preloader('#ezmodal-body-'+idVendor, 'hide');
                $('button#ezproduct-review').hide();

                if(_set == 'selected'){
                    product.trigger('change');
                }
            }
        });

        $('body').on('change', '#eazy-select-package', function(e){
            var pid     = $(this).val(),
                lang    = $(this).data('lang')
                self    = $(this);


            if(pid !== ''){
                datePicker.prop('disabled', false);
                personPicker.val('0');
                personPicker.trigger('change');
                $('button#ezproduct-review').show();
                //timePicker.prop('disabled', false);
                //personPicker.prop('disabled', false);
            }else{
                datePicker.prop('disabled', true);
                timePicker.prop('disabled', true);
                personPicker.prop('disabled', true);
                $('button#ezproduct-review').hide();
            }
            if(pid!='0'){
                getData({
                    url : targetUrl +'/api/products.php',
                    data : {id:pid, lang:lang},
                    beforeSend : function(e){
                        preloader('#ezmodal-body-'+idVendor, 'show');
                    },
                    success : function(result){
                        $('#ezpackage-information').html(result.product_description);
                        $('#ez-carousel-'+result.id_product).carousel();
                        $('#ezpackage-information').append('<hr /><div class="clearfix" id="review-box"></div>');
                        loadReview();
                        preloader('#ezmodal-body-'+idVendor, 'hide');

                        self.data('pbw', result.product_booking_window);

                        if(result.product_booking_window == 24){
                            console.log(result.product_booking_window);
                            // belum selesai
                            datePicker.data('DateTimePicker').destroy();
                            datePicker.datetimepicker({
                                format: 'YYYY-MM-DD',
                                useCurrent: false,
                                minDate: moment().add(1,'days'),
                                // debug : true
                            });;
                        }

                        datePicker.prop('disabled', false);
                        submitButton.prop('disabled', true);
                        $('#crot-tabs').css('display', '');
                    }
                });
            }else{
                datePicker.prop('disabled', true);
                timePicker.prop('disabled', true);
                timePicker.val('0');
                personPicker.prop('disabled', true);
                personPicker.val('0');
                submitButton.prop('disabled', true);
            }
        }).on('dp.show', '#eazy-select-date', function(e){
            $('#ezwidget.ezbootstrap.widgetbooking .bootstrap-datetimepicker-widget table th.prev').html('<i class="fa fa-chevron-left"></i>');
            $('#ezwidget.ezbootstrap.widgetbooking .bootstrap-datetimepicker-widget table th.next').html('<i class="fa fa-chevron-right"></i>');
        }).on('dp.change', '#eazy-select-date', function(e){
            var date = e.date.format('YYYY-MM-DD'),
                id_product = product.val(),
                allotment = '<option value="0">Select time</option>',
                person = '<option value="0">Person</option>';

            personPicker.prop('disabled', true);
            submitButton.prop('disabled', true);
            getData({
                url: targetUrl +'/api/enquiry.php',
                data : {
                    date : date,
                    product: id_product,
                    pbw : $('#eazy-select-package').data('pbw')
                },
                success :function(data){
                    $.each(data.time, function(index, value){
                        allotment += '<option value="'+value+'">'+value+'</option>';
                    });
                    $.each(data.person, function(index, value){
                        person += value;
                    });
                    timePicker.html(allotment);
                    timePicker.prop('disabled', false);
                    personPicker.html(person);
                }
            });
        }).on('change', '#eazy-select-time', function(e){
            var date = datePicker.val(),
                id_product = product.val(),
                time = $(this).val(),
                allotment = '<option value="0">Select time</option>',
                person = '<option value="0">Person</option>';
            if(time!='0'){
                getData({
                    url: targetUrl +'/api/enquiry.php',
                    data : {
                        date : date,
                        product: id_product,
                        time : time
                    },
                    success :function(data){

                        // $.each(data.person, function(index, value){
                        //     person += value;
                        // });
                        var jmlPerson = data.person.length;
                            jmlPerson = checkPerson(id_product, date, time, jmlPerson);
                        for(var ip = 1; ip<=jmlPerson; ip++){
                            person += '<option value="'+ip+'">'+ip+'</option>';
                            console.log(person);
                        }
                        personPicker.html(person);
                        personPicker.prop('disabled', false);
                    }
                });
            }else{
                personPicker.prop('disabled', true);
                submitButton.prop('disabled', true);
            }
        }).on('change', '#eazy-select-person', function(e){
            if(this.value!= '0'){
                submitButton.prop('disabled', false);
            }else{
                submitButton.prop('disabled', true);
            }

        }).on('submit', '#ezform-package', function(e){
            e.preventDefault();
            if(product.val()=='0' || datePicker.val()==='' || timePicker.val()=='0' || personPicker.val()=='0'){
                // do nothing;
                console.log(product.val() + '-------------product');
                console.log(datePicker.val() + '-------------date');
                console.log(timePicker.val()  + '-------------time');
                console.log(personPicker.val() + '-------------person');
                //alert('Please select all options before add to cart');
                //return false;
            }else{
                var price   = product.find('option:selected').data('price'),
                    person  = personPicker.val(),
                    cart    = '('+person+') '+(price*person),
                    date    = datePicker.val(),
                    time    = timePicker.val(),
                    id_product = product.val(),
                    cartItemId = id_product+date+time;

                updateBookData(cartItemId, id_product, price, person, date, time);
                if(useBrowserStorage){
                    localStorage.setItem('enquiry', JSON.stringify(book_data));
                    var _date = new Date();
                    localStorage.setItem('enquiry_expire', _date);
                }

                putData({
                    url : targetUrl +'/api/enquiry.php',
                    type: 'PUT',
                    data : {
                        mode    : 'add_to_cart',
                        price   : price,
                        person  : person,
                        date    : date,
                        time    : time,
                        use_session : !useBrowserStorage,
                        id_product  : $('#package').val()
                    },
                    dataType :'html',
                    beforeSend : function(e){
                        preloader('#ezmodal-body-'+idVendor, 'show');
                    },
                    success : function (result){
                        product.val('0');
                        product.trigger('change');
                        timePicker.val('0');
                        personPicker.val('0');
                        showCartItem();
                        renderCartPage('.tab-content > #cart');
                        preloader('#ezmodal-body-'+idVendor, 'hide');
                    }
                });
            }
            return false;
        });

    }

    function renderCartPage(element_to_render){
        var data = {};
        if(useBrowserStorage){
            data = {
                expire : localStorage.getItem('enquiry_expire'),
                enquiries : localStorage.getItem('enquiry')

            };
        }
        putData({
            type : 'POST',
            url     : targetUrl +'/api/enquiry.php?view=cart',
            data    : data,
            dataType : 'html',
            success : function(result){
                $(element_to_render).html(result);
            }
        });
    }

    function checkPerson(id_product, date, time, person){
        var items = 'nolocalitems',
            itemJSON,
            sisaPerson = person;
        if(useBrowserStorage){
            itemJSON = localStorage.getItem('enquiry');
            items = JSON.parse(itemJSON);
            console.log(items);
        }
        if(items!='nolocalitems'){
            $.each(items, function(key, val){

                if(id_product==val.id_product && date == val.date && time==val.time){
                    sisaPerson -=val.person;
                    console.log(sisaPerson);
                }
            });
        }

        return sisaPerson;
    }

    renderPopup = function(idVendor){
        var header =    '<div class="modal-header">'+
                            '<img src="" alt="spa logo" id="ezmodal-logo-'+idVendor+'" height="50" />'+
                            '<div class="pull-right" id="ezmodal-cart-'+idVendor+'" style="margin-top:15px;">'+
                                '<div class="btn-group">'+
                                    '<a class="btn btn-success cart-item" style="font-size:18px; font-weight:bold;">'+
                                        '<i class="fa fa-shopping-cart" style="vertical-align: middle;"></i>  &nbsp;'+
                                        '<span id="ezcartitem" style="vertical-align: middle;"> 0 item</span>'+
                                    '</a>'+
                                '</div>'+
                            '</div>'+
                        '</div>',
            body  =      '<div class="modal-body" id="ezmodal-body-'+idVendor+'" style="min-height:450px"></div>',
            footer = '',
            modal =     '<div id="ezwidget" class="ezbootstrap widgetbooking">'+
                            '<div class="modal fade" id="ezmodal-'+idVendor+'" tabindex="-1" role="dialog">'+
                                '<div class="modal-dialog modal-lg" role="document">'+
                                    '<div class="modal-content">'+
                                    header+
                                    body+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>',
            modalId,
            modalLogo,
            modalBody,
            modalFooter;

        $('body').append(modal);

        modalId     = $('#ezmodal-'+idVendor);
        modalLogo   = $('#ezmodal-logo-'+idVendor);
        modalBody   = $('#ezmodal-body-'+idVendor);
        modalCart   = $('#ezmodal-cart-'+idVendor);
        modalFooter = null;

        this.toggleModal = function(){
            modalId.toggle();
        };
        this.hideModal = function(){
            modalId.modal('hide');
        };
        this.showModal = function(){
            modalId.modal('show');
        };

        modalId.on('shown.bs.modal', function(e){

            showCartItem();
            var leftForm =  '<form id="ezform-package">'+
                                '<div class="form-group">'+
                                    '<select id="eazy-select-package" name="eazy-select-package" class="form-control"><option value="0">Select Treatment</option></select>'+
                                '</div>'+
                                '<div class="form-group">'+
                                    '<input type="text" id="eazy-select-date" name="eazy-select-date" class="form-control" placeholder="Date" disabled />'+
                                '</div>'+
                                '<div class="form-group">'+
                                    '<select id="eazy-select-time" name="eazy-select-time" class="form-control" disabled><option value="0">Select time</option></select>'+
                                '</div>'+
                                '<div class="form-group">'+
                                    '<select id="eazy-select-person" name="eazy-select-person" class="form-control" disabled><option value="0">Person</option></select>'+
                                '</div>'+

                                // button submit book
                                '<div class="form-group">'+
                                    '<button type="submit" class="btn btn-success btn-block" name="submit-book" id="submit-book">Add To Cart</button>'+
                                '</div>'+

                                // button review;
                                '<div class="form-group" style="margin-top:20px;">'+
                                    '<button type="button" class="btn btn-primary btn-block" name="ezproduct-review" id="ezproduct-review">Customer Review</button>'+
                                '</div>'+

                                '<div class="form-group" style="margin-top:10px;"><center>Powered by <a href="https://eazyengine.com/" title="Eazy Engine System" target="_blank">Eazy Engine</a></center></div>'+
                            '</form>',
                leftContainer = '<div class="col-md-3">'+ leftForm +'</div>',
                body        = '<div class="col-md-9" id="ezpackage-information"></div>',
                fullBody    = '<div class="row" id="browse-treatment"> '+ leftContainer +' '+ body +' </div>';

            modalBody.html('<div class="row"><div class="col-md-12">'+
                                    '<ul class="nav nav-tabs" id="crot-tabs" role="tablist" style="display:none;">'+
                                        '<li role="presentation" class="active">'+
                                            '<a href="#prdt" aria-controls="prdt" role="tab" data-toggle="tab"><div>Select Product <br /><span>1</span></div></a>'+
                                        '</li>'+
                                        '<li role="presentation" disabled><a disabled href="#cart" aria-controls="cart" role="tab" data-toggle="tab"><div>View Cart <br /><span>2</span></div></a></li>'+
                                        '<li role="presentation" class="noclick" disabled><a disabled href="#pymn" aria-controlspymn" role="tab" data-toggle="tab"><div>Payment <br /><span>3</span></div></a></li>'+
                                        '<li role="presentation"><a disabled  href="#fins" aria-controls="fins" role="tab" data-toggle="tab"><div>Finished <br /><span>4</span></div></a></li>'+
                                    '</ul>'+
                                    '<div class="tab-content">'+
                                        '<div role="tabpanel" class="tab-pane active" id="prdt">'+fullBody+'</div>' +
                                        '<div role="tabpanel" class="tab-pane " id="cart"></div>' +
                                        '<div role="tabpanel" class="tab-pane " id="pymn"></div>' +
                                        '<div role="tabpanel" class="tab-pane " id="fins"></div>' +
                                    '</div>'+
                                '</div></div>');

            getData({
                url: targetUrl +'/api/vendor.php?loadwidgetdata',
                beforeSend : function(e){
                    preloader('#ezmodal-body-'+idVendor, 'show');
                },
                success : function(result){
                    setLogo(result.vendor_logo);
                    var vendor_descript =   '<div class="row">'+
                                            '<div class="col-md-12">'+
                                                '<center><img src="'+result.vendor_logo +'" height:200px; /></center>'+
                                                '<div class="clearfix" style="margin-top:20px;">'+result.vendor_description +'</div>' +
                                            '</div>'+
                                        '</div>';
                    $('#ezpackage-information').html(vendor_descript);
                    loadsetPackage();
                    renderCartPage('.tab-content > #cart');
                    renderPayment('.tab-content > #pymn');
                    //---------------------------------------------------------
                    preloader('#ezmodal-body-'+idVendor, 'hide');
                }
            });
        }).on('hide.bs.modal', function(e){
            var c = confirm("Do you want to leave the booking page?\nIf you confirmed, you will loss exisiting data.");
            if(!c){
                return false;
            }
            return;
        }).on('hidden.bs.modal', function(e){

        });

        this.setLogo = function(imgUrl){
            modalLogo.attr('src', imgUrl);
            modalLogo.css('height', '50px');
        };

        modalId.on('shown.bs.tab', '#crot-tabs', function(e){
            // var heigh = $('.tab-content .tab-pane.active > div').height() + 800;
            // console.log(heigh);
            // modalId.css('height', heigh+'px');
            // $('body').css('height', heigh+'px');
            // $('body').css('overflow', 'auto');
            $('#crot-tabs').css('display', '');
        }).on('click', '.cart-item', function(e){
            $('#crot-tabs a[href="#cart"]').tab('show');
        }).on('click', '.noclick > a[data-toggle="tab"]', function(e){
            e.preventDefault();
            console.log('noclickable');
            return false;
        }).on('click', '.delete-cart-item', function(e){
            var cartItemId = $(this).attr('cartitemid');
            deleteBookDataItem(cartItemId);
            renderCartPage('.tab-content > #cart');
            showCartItem();
        }).on('click', '#ezproduct-review', function(e){
            var reviewTemplate = loadReviewForm();

        }).on('click', '#submit-review', function(e){
            var data = $('form#review-form').serialize()+'&mode=submit_review&target='+$('select#eazy-select-package').val();
            putData({
                url: targetUrl +'/api/products.php',
                data : data,
                beforeSend : function(e){
                    $('form#review-form').find('.form-control').prop('disabled', true);
                    $('#submit-review').html('Submiting review...');
                },
                success :function(result){
                    if(result.status === true){
                        $('form#review-form').find('.form-control').val('');
                        alert('Thank you for reviewing our treament.');
                    }else{
                        alert('Your review could not be saved due to connection problem. [code : rev-01]');
                    }

                    $('form#review-form').find('.form-control').prop('disabled', false);
                    $('#submit-review').html('Submit Review');
                }
            });
        }).on('click', '#cancel-review', function(e){
            $(this).closest('form').find('input.form-control').val('');
            $('select#eazy-select-package').trigger('change');

        }).on('click', '#btn-checkout', function(e){
            var items = 'nolocalitems',
                couponvalue = '0',
                coupon = '';
            if(useBrowserStorage){
                items = localStorage.getItem('enquiry');
            }

            putData({
                url  : targetUrl +'/api/enquiry.php',
                type : 'PUT',
                data : {

                        mode : 'place_cart',
                        items: items,
                        coupon : coupon,
                        couponvalue : couponvalue,
                    },
                beforeSend : function(e){
                    preloader('#ezmodal-body-'+idVendor, 'show');
                },
                success : function (result){
                    if(result.status){
                        $('#MALLID').val(result.mallid);
                        $('#TRANSIDMERCHANT').val(result.transid);
                        $('#AMOUNT, #PURCHASEAMOUNT').val(result.amount);
                        $('#WORDS').val(result.words);
                        $('#BASKET').val(result.dokubasket);
                        $('#eid').val(result.enquiry_id);
                        $('#sum-subtotal').data('value', result.total_raw);
                        $('#sum-subtotal').html(result.total_formatted);
                        if(parseFloat( result.tax_raw)>0){
                            $('#tax-text').html("TAX ("+parseFloat(result.tax_raw)+"%)");
                            $('#tax-total').parent('tr').removeClass('hidden');
                            $('#tax-total').data('value', parseFloat(result.tax_raw));
                            $('#tax-total').html(result.tax_value_formatted);
                            $('#grand-total').html(result.total_after_tax_formatted);
                        }else{
                            $('#grand-total').html(result.total_formatted);
                        }

                        $('#crot-tabs a[href="#pymn"]').tab('show');
                        $('#atmtype').val(result.atmtype);


                    }else{
                        console.log('invalid input');
                    }
                    preloader('#ezmodal-body-'+idVendor, 'hide');
                }
            });

        });
        return this;

    };

    function renderPayment(target_to_render){

        getData({
            url : targetUrl +'/api/vendor.php?renderPaymentPage&view=payment_form',
            dataType : 'html',
            success : function(data){
                $(target_to_render).html(data);
            }
        });

        $(document).on('click', '#btn-coupon', function(e){
            getData({
                url : targetUrl +'/api/coupon.php',
                data : {
                    kpn : $('#kupon').val(),
                    subtotal : $('#sum-subtotal').data('value'),
                    email : $('#email').val(),
                    eid : $('#eid').val(),
                    tid : $('#TRANSIDMERCHANT').val()
                },
                beforeSend : function(e){
                    preloader('#ezmodal-body-'+idVendor, 'show');
                },
                success : function(result){
                    if(typeof result.total != 'undefined'){
                        $('#grand-total').html(result.total);
                        $('#kupon-value').html(result.discount);
                        $('#kupon-value').data('value', result.rawdisc);
                        $('#kupon-value').closest('tr').removeClass('hidden');
                        $('#tax-total').html(result.tax_value);
                        $('#tax-total').data('value', result.rawtax);

                        $('#AMOUNT, #PURCHASEAMOUNT').val(result.dokuamount);
                        var oldbasket = $('#BASKET').val();
                        $('#BASKET').val(oldbasket + result.dokubasket);
                        $('#WORDS').val(result.rwst);
                    }else{
                        $('#kupon-value').closest('tr').addClass('hidden');
                        $('#kupon-value').html('0');
                        $('#kupon-value').data('value', 0);
                    }
                    preloader('#ezmodal-body-'+idVendor, 'hide');
                }
            });
        }).on('click', '#paynow', function(e){
            var chek = $('#terms').is(':checked'),
                payment_method = $('#payment_method:checked').val(),
                atmtype = $('#atmtype').val();

            if(!chek){
                alert('You need to accept term & conditions.');
                return false;
            }
            var error = 0,
                attr = '';
            $('#form-method .form-control').each(function(i, elm){
                attr = $(elm).attr('required');

                if((typeof attr !== typeof undefined && attr !== false) && ($(elm).val()== '0' || $(elm).val() === '')){
                    $(elm).parent().addClass('has-error');
                    //$(elm).parent().append('<span class="help-block">field required</span>');
                    error +=1;
                }else{
                    $(elm).parent().removeClass('has-error');
                    $(elm).parent().find('.help-block').remove();
                }
            });

            if(error === 0){
                var items = 'nolocalitems',
                    ccode = $('#country option:selected').data('phonecode'),
                    phone = ccode+ ' ' +$('#phone').val(),
                    usecoupon = $('#kupon').val(),
                    couponValue = $('#kupon-value').data('value'),
                    trial   = $('#not_doku_coy').val() == 1 ? true :  false;
                if(useBrowserStorage){
                    items = localStorage.getItem('enquiry');
                }

                putData({
                    url : targetUrl +'/api/enquiry.php',
                    type : 'PUT',
                    data : {
                                mode : 'confirm_cart',
                                enquiry_id : $('#eid').val(),
                                fname : $('#fname').val(),
                                lname : $('#lname').val(),
                                email : $('#email').val(),
                                ccode : $('#country').val(),
                                phone : phone,
                                note : $('#note').val(),
                                payment_method : $('.payment_method_c:checked').val(),
                                usecode : usecoupon,
                                codevalue : couponValue,
                                not_doku_coy : $('#not_doku_coy').val()
                            },
                    beforeSend : function(e){
                        preloader('#ezmodal-body-'+idVendor, 'show');
                    },
                    success :function(data){
                        if(data.status){
                            $('#NAME').val($('#fname').val()+' '+ $('#lname').val());
                            $('#EMAIL').val($('#email').val());
                            $('#MOBILEPHONE').val(phone);
                            localStorage.setItem('enquiry', '[]');
                            localStorage.setItem('enquiry_expire', '');
                            // renderCartPage();

                            $('#SESSIONID').val(data.session_id);

                            if(data.return_thanks==false){

                                if(payment_method == 'dokucreditcard'){
                                    // payment channel 01;
                                    $('#PAYMENTCHANNEL').val('15');
                                    $('#form-method').submit();
                                } else if(payment_method == 'doku'){
                                    // payment channel 05;
                                    $('#PAYMENTCHANNEL').val($('#PAYMENTCHANNEL').data('atm'));
                                    if(atmtype == 'atm_agregator'){
                                        $('#form-method').submit();
                                    }else{
                                        // generate payment code!!;
                                        // atm direct generate payment code sendiri!!
                                        var dataForm = $('#form-method').serialize();

                                        getData({
                                            //async : false,
                                            url : targetUrl +'/api/enquiry.php?view=finish&enquiry='+$('#eid').val(),
                                            dataType : 'html',
                                            success : function(result){
                                                book_data = [];
                                                localStorage.setItem('enquiry', '[]');
                                                localStorage.setItem('enquiry_expire', '');
                                                showCartItem();
                                                $('#fins').html(result);
                                                $('#crot-tabs a[href="#fins"]').tab('show');
                                                renderCartPage('.tab-content > #cart');
                                            }
                                        });
                                    }
                                }
                            } else {
                                //renderFinish(data.enquiry_id);
                                getData({
                                    //async : false,
                                    url : targetUrl +'/api/enquiry.php?view=finish&enquiry='+data.enquiry_id,
                                    dataType : 'html',
                                    success : function(result){
                                        book_data = [];
                                        localStorage.setItem('enquiry', '[]');
                                        localStorage.setItem('enquiry_expire', '');
                                        showCartItem();
                                        $('#fins').html(result);
                                        $('#crot-tabs a[href="#fins"]').tab('show');
                                        renderCartPage('.tab-content > #cart');
                                    }
                                });
                            }

                        }else{
                            console.log('data not valid');
                        }
                        preloader('#ezmodal-body-'+idVendor, 'hide');
                    }
                });
            }else {
                alert('Fill all required field');
            }
        }).on('click', '.payment-option', function(e){
            $('.footernote').css('display', 'none');
            $(this).find('.footernote').css('display', 'block');
        });
    }


    function loadReviewForm(page){
        var templateForm =  '<div class="row">'+
                            '<div class="col-md-12">'+
                                '<div class="form">'+
                                    '<form id="review-form" onsubmit="return false;">'+
                                        '<div class="form-group">'+
                                            '<div class="row">'+
                                                '<div class="col-md-6"><input maxlength="70" type="text" id="review-name" name="review-name" class="form-control" placeholder="your name here" required /></div>'+
                                                '<div class="col-md-6"><input maxlength="50" type="email" id="review-email" name="review-email" class="form-control" placeholder="your email here" required /></div>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="form-group">'+
                                            '<input type="text" maxlength="40" id="review-title" name="review-title" class="form-control" placeholder="your review title here" required />'+
                                        '</div>'+
                                        '<div class="form-group">'+
                                            '<textarea class="form-control" id="review-text" name="review-text" placeholder="your review here" required maxlength="250"></textarea>'+
                                        '</div>'+
                                        '<div class="form-group">'+
                                            '<button type="button" name="submit-review" id="cancel-review" class="btn btn-default">Cancel</button>'+
                                            '&nbsp;&nbsp;&nbsp;'+
                                            '<button type="button" name="submit-review" id="submit-review" class="btn btn-primary">Submit Review</button>'+
                                        '</div>'+
                                    '</form>'+
                                '</div>'+
                            '</div>'+
                        '</div><br /><hr />';

        $('#ezpackage-information').html(templateForm);
        return templateForm;
    }

    function loadReview(){
        var mainTemplate =  '<div id="ezproduct-review-slider" class="carousel slide ez-carousel" data-ride="carousel">'+
                            '<!-- Wrapper for slides -->'+
                            '<div class="carousel-inner" role="listbox">'+
                                '{[review_item_here]}'+
                            '</div>'+
                            '<!-- Controls -->'+
                            '<a class="left carousel-control" href="#ezproduct-review-slider" role="button" data-slide="prev">'+
                                '<span class="glyphicon" aria-hidden="true" style="top:45%;"><i class="fa fa-2x fa-chevron-left"></i></span>'+
                                '<span class="sr-only">Previous</span>'+
                            '</a>'+
                            '<a class="right carousel-control" href="#ezproduct-review-slider" role="button" data-slide="next">'+
                                '<span class="glyphicon" aria-hidden="true" style="top:45%;"><i class="fa fa-2x fa-chevron-right"></i></span>'+
                                '<span class="sr-only">Previous</span>'+
                            '</a>'+
                        '</div>',
            reviewItemTemplate = '<div class="item {[active]}">'+
                                    '<div class="carousel-caption" style="color:#000 !important; position:unset; text-shadow:none;">'+
                                        '<p><strong>{[review_title]}</strong></p>'+
                                        '<p><small>{[reviewer_information]}</small></p>'+
                                        '<p>{[review_content]}</p>'+
                                    '</div>'+
                                '</div>',

            _singleReview = ''.
            contentReview = '',
            reviewResult  = '',
            id_product = $('select#eazy-select-package').val();

        getData({
            url: targetUrl +'/api/products.php',
            dataType : 'JSON',
            data : {mode : 'product_review', target: id_product},
            beforeSend : function(){
                $('#review-box').css('height', '200px');
                $('#review-box').html('<center><i class="fa fa-spin fa-cog"></i> Loading review...</center>');
            },
            success : function(result){
                if(result.status === true){
                    contentReview = '';
                    //console.log(result.reviews);
                    $.each(result.reviews, function(key, value){
                        //console.log(value);
                        _singleReview = reviewItemTemplate.replace('{[review_title]}', value.review_title);
                        _singleReview = _singleReview.replace('{[reviewer_information]}', value.reviewer_information);
                        _singleReview = _singleReview.replace('{[review_content]}', value.review);
                        if(key===0){
                            _singleReview = _singleReview.replace('{[active]}', 'active');
                        }else{
                            _singleReview = _singleReview.replace('{[active]}', '');
                        }
                        contentReview += _singleReview;
                        //console.log(contentReview);
                    });



                    //console.log('------'+contentReview);
                    if(result.reviews.length>=1){
                        reviewResult = mainTemplate.replace('{[review_item_here]}', contentReview);
                        $('#review-box').html(reviewResult);
                        $('#review-box').carousel();
                    }else{
                        $('#review-box').html('');
                    }
                }else{
                    $('#review-box').html('');
                }
            }
        });
    }

    function widget($element, _options, $){
        var default_options = {
                    secret_key      : '',
                    vendor_token    : '',
                    vendor_id       : '',

                    isPopup         : true,
                    modal_title     : 'Loading...',

                    useBrowserStorage : false,
                    targetUrl       : 'https://admin.eazyengine.com'
                },
            options,
            modalWidget;

        options = $.extend(default_options, _options);

        if(options.targetUrl.indexOf('https') <0){
            options.targetUrl = options.targetUrl.replace('http', 'https');
        }

        if (typeof(Storage) !== "undefined") {
            useBrowserStorage = true;
            console.log('Your browser support local storage.');
            var _expdate = localStorage.getItem('enquiry_expire'),
                expdate = new Date(_expdate),
                today = new Date(),
                hours = Math.abs(today - expdate) / 3.6e6;
            // disuru clear cart kalau close popup;
            book_data = [];
            localStorage.setItem('enquiry', '[]');
            localStorage.setItem('enquiry_expire', '');
            if(hours<6){
                // book_data = $.parseJSON(localStorage.getItem('enquiry'));
                // console.log(book_data.length + ' item saved');
            }else{
                // localStorage.setItem('enquiry', '[]');
                // console.log('your cart session expired.');
            }

        } else {
            useBrowserStorage = false;
            console.log('Your browser not support local storage. Go get new browser version!');
        }

        token = options.vendor_token;
        secretKey = options.secret_key;
        targetUrl = options.targetUrl;
        idVendor = options.vendor_id;

        if(options.isPopup === true){
            modalWidget = renderPopup(options.vendor_id);
            //modalWidget.setLogo('http://www.eazyspadeals.com/wp-content/uploads/2016/01/logo.png');
            //modalWidget.showModal();
            $($element).css('cursor', 'pointer');
            $($element).click(function(e){
                e.preventDefault();
                book_data = [];

                window.scrollTo(0,0);

                treatmentId = $(this).attr('eazytreatmentid');
                if(typeof treatmentId == 'undefined'){
                    treatmentId = $(this).data('eazytreatmentid');
                }

                localStorage.setItem('enquiry', '[]');
                localStorage.setItem('enquiry_expire', '');
                modalWidget.showModal();
            });
        }

        var ulrParams = {};

        if (location.search) {
            var parts = location.search.substring(1).split('&');

            for (var i = 0; i < parts.length; i++) {
                var nv = parts[i].split('=');
                if (!nv[0]) continue;
                ulrParams[nv[0]] = nv[1] || true;
            }
        }
        // Now you can get the parameters you want like so:
        var redirectfromdoku = (typeof ulrParams.dokurediriect != 'undefined') ? ulrParams.dokurediriect : 0;
        if(redirectfromdoku==1){
            var message = ulrParams.message.replace(/\+/g, ' '),
                expireText = '',
                recip = '',
                emailSent = '';
            message = message.replace(/%20/g, ' ');
            if(typeof ulrParams.expire !='undefined'){
                expireText = 'You have 2 hours to settle the payment for this booking';
            }

            if(typeof ulrParams.email != 'undefined'){
                emailSent = ulrParams.email.replace(/\+/g, ' ');
                emailSent = emailSent.replace(/%20/g, ' ');
                recip = ulrParams.recip.replace(/\+/g, ' ');
                recip = recip.replace(/%40/g, '@');
                emailSent = "We've sent a "+emailSent+" to "+recip+"";
                if(ulrParams.email=='voucher' || ulrParams.email=='Voucher'){
                    expireText = '';
                }
            }

            if(typeof ulrParams.recip != 'undefined' && ulrParams.recip=='FAILED'){
                emailSent   = '';
                recip       = '';
                emailSent   = '';
                expireText = '';
            }

            $('#ezwidget').append('<div class="modal fade" id="modal-ezredirect" tabindex="-1" role="dialog" style="z-index:9999999;">'+
                                '<div class="modal-dialog" role="document">'+
                                '<div class="modal-content">'+
                                '<div class="modal-body">'+
                                '<p><center><strong>'+message+'</strong><br />'+emailSent+'<br /><br />'+expireText+'</center></p>'+
                                '</div>'+
                                '</div><!-- /.modal-content -->'+
                                '</div><!-- /.modal-dialog -->'+
                                '</div><!-- /.modal -->');

            $('#modal-ezredirect').modal('show');
            $('#modal-ezredirect').on('hidden.bs.modal', function(e){
                $('#ezwidget').find('#modal-ezredirect').remove();
            });
        }

        $(document).on('click', '#ez_term_condition', function(e){
            e.preventDefault();
            var url = $(this).attr('href');
            //window.open(url, 'Term &amp; Conditions', "width=700,height=600");
            PopupCenter(url, 'Term & Condition', 700, 600);
        });

        function PopupCenter(url, title, w, h) {
            // Fixes dual-screen position                         Most browsers      Firefox
            var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
            var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

            var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

            var left = ((width / 2) - (w / 2)) + dualScreenLeft;
            var top = ((height / 2) - (h / 2)) + dualScreenTop;
            var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

            // Puts focus on the newWindow
            if (window.focus) {
                newWindow.focus();
            }
        }
    }

//})(jQuery);
