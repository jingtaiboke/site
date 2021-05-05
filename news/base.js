//good user 
document.onfocus= function(){
    console.log(t)
    var t = event.currentTarget.style;
    t.backgroundColor = 'black';
    t.color = 'white';
    t.fontSize = 'larget';
}

//close box when click other part
document.onclick = function(e){
    if(document.getElementById('login-box').style.display =='none'){
        return
    }else{
        document.getElementById('login-box').style.display = 'none'
    }
};
//add login or regist box
function show_box(v){
    var box = document.getElementById('login-box');

    if(box.style.display == 'none'){
        if(v=='l'){
            box.innerHTML = `
            <form method="POST" action="/login">
            account<input type="email" name="account" title="account"><br>
            password<input type="password" name="pwd" title="password"><br>
            <input type="checkbox" class="light">rember
            <input type="submit">
            <input type="button" onclick="close_box()" value="close">
            </form>
            `
        }else if(v== 'r'){
            box.innerHTML = `
            <form method="POST" action="/regist">
            account<input type="email" name="account" title="account,please be a email"><br>
            password<input type="password" name="pwd" title="password"><br>
            check<input type="password" title="check password"><br>
            <input type="submit">
            <input type="button" onclick="close_box()" value="close">
            </form>
            `
        }else{
            box.innerHTML = `
            <a href="/user/`+v+
            `">Profile</a> <a href="/logout">logout</a>
            `
        };
      
        box.onclick = function(e){
            e.stopPropagation()
        };
        box.style.display ='block';
    }else{
        box.style.display ='none'
    };
    event.stopPropagation()
};

// for close button
function close_box(){
    document.getElementById('login-box').style.display = "none";
}

//
function show_discuz_box(){
    var v = event.path[3].children[2].style.display;
    var nl = document.getElementsByClassName('discuz-input');
    [].slice.call(nl).forEach(el=> {
        el.style.marginTop = '-1rem';
        el.style.display = 'none';
    });
    if(v == 'block'){
        event.path[3].children[2].style.marginTop = '-1rem';
        event.path[3].children[2].style.display = 'none'
    }else{
        event.path[3].children[2].style.marginTop = '0';
        event.path[3].children[2].style.display = 'block'
    }
}

//prevent post again
//have post
var HAVE_POST =false;
function repost(){
    if(HAVE_POST){
        return false;
    }else{
        HAVE_POST = true;
        return true
    }
}

//
function remove(type,id){
    var url = '/rm/'+type+'/'+id;
    var wrapper = event.path[2];
    var ajax = new XMLHttpRequest;
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4){
            if(ajax.status == 200){
                if(ajax.responseText == 'ok removed'){
                    wrapper.innerHTML = '<span class="no-more">reply removed</span>';
                    if(type =='post'){
                        alert('post remove');
                        window.location.href='/';
                    }
                }
            }else{
                console.log('ajax error')
            }
        }
    };
    ajax.open('GET',url);
    ajax.send();
    event.currentTarget.disabled ='true'
}

//
function add_discuz(){
    var url = '/add_discuz'
    var reply_id = event.path[1].children[0].value,
    content = event.path[1].children[1].value;
    var data = 'reply_id='+reply_id+'&content='+content;
    var box = document.getElementById('discuz-ul');
    var item = document.createElement('li');

    var ajax =new XMLHttpRequest;
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4){
            if(ajax.status == 200){
                if(ajax.responseText=='ok add discuss'){
                    item.innerText = "i replied: "+content;
                    box.appendChild(item);
                }else{
                    alert(ajax.responseText)
                }
            }else{
                console.log('ajax error')
            }
        }
    };
    ajax.open('POST',url);
    ajax.setRequestHeader('Content-Type','application/x-www-form-urlencoded',)
    ajax.send(data)


}

function star(post_id){
    var url = '/star/'+post_id;
    var ajax = new XMLHttpRequest;
    var that = event.path[0];
    console.log(that)

    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4){
            if(ajax.status == 200){
                if(ajax.responseText == 'ok star'){
                    that.classList += ' no-more';
                    that.innerText = that.innerText+'+1';
                    that.disabled ='true'
                }else{
                    alert(ajax.responseText)
                }
            }else{
                console.log('ajax error')
            }
        }
    };
    ajax.open('GET',url);
    ajax.send();
}

//
function main(){
    
    //inital login-box
    document.getElementById('login-box').style.display = "none";

    //post editor auto save 
    if(document.forms["editor-post"]){

        var form = document.forms["editor-post"];
        var editing_post = localStorage.getItem('editing-post');
        if (editing_post){
            var data = JSON.parse(editing_post);
            form.title.value = data['title'];
            form.topic.value = data['topic'];
            form.content.value = data['content'];
        }else{
            var data = JSON.stringify({
                'title':form.title.value,
                'topic':form.topic.value,
                'content':form.content.value
            });
            localStorage.setItem('editing-post',data)
        };
        var auto_save = setInterval(()=>{
            var data = JSON.stringify({
                'title':form.title.value,
                'topic':form.topic.value,
                'content':form.content.value
            });
            localStorage.setItem('editing-post',data);
            var date = new Date;
            document.getElementById('editor-post-tip').innerText = 'Edit auto saved at'+date.toString();
        },8500)
    }else{
        false
    };

    //good time 
    var time_boxes = document.getElementsByClassName('good-time');
    if(time_boxes){
        for(var i in time_boxes){
            var t = time_boxes[i].innerText;
            var good_t = timeago.format(t);
            time_boxes[i].innerText = good_t;
        }
    };

    //hidden the delete button
    var ownner_wrapper = document.getElementsByClassName('ownner');
    var me = document.getElementById('mine');
    for(var i of ownner_wrapper){
        if(i.getAttribute('ownner') != me.value){
            i.classList.add('hidden-delete')
        }
    }

};


window.onload = function(){
    main()
};
