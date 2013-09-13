function log(str)
{
  return console.log(str)
}


function drawBgImage(path_to_image)
{
    log(path_to_image);
    var image = new Kinetic.Image({
            x: frame_offsetX,
            y: frame_offsetY,
            width: 640,
            height: 240,
            draggable: false
            });

    current_layer.add(image);
    imageObj = new Image();
    imageObj.src = path_to_image;
    imageObj.onload = function()
    {
        image.setImage(imageObj);
        image.setId('bg');
        image.moveToBottom();
        current_layer.draw()
    };
}

function changeBg(e, dragSrcEl)
{
    var children = current_layer.getChildren();
    for (var i = 0; i < children.length; i++)
    {
        if (children[i].getZIndex() === 0)
        {
            children[i].destroy()
        }
    }
    drawBgImage(dragSrcEl.src)
}

function addCharImg(e, dragSrcEl)
{
    var image = new Kinetic.Image({
           draggable : true,
           x: frame_offsetX + 10,
           y: frame_offsetY + 10,
           
            dragBoundFunc: function (pos) {
                var thisImg = this;
                var bound_loX = frame_offsetX ;
                var bound_hiX = frame_offsetX + FRAME_WIDTH;
                var bound_loY = frame_offsetY;
                var bound_hiY = frame_offsetY + FRAME_HEIGHT;
                if (pos.x < bound_loX || pos.x > bound_hiX || pos.y < bound_loY || pos.y > bound_hiY)
                {
                    var tween = new Kinetic.Tween(
                    {
                        node: thisImg,
                        duration: 0.2,
                        opacity: 0,
                        onFinish: function () 
                        {
                           thisImg.hide();
                           thisImg.setOpacity(1);
                        }
                    });
                   tween.play();
                }
                return { x: pos.x, y: pos.y};
                }
            });

    current_layer.add(image);
    imageObj = new Image();
    imageObj.src = dragSrcEl.src;
    imageObj.onload = function()
    {
        factor = 0.07;
        var width = imageObj.width * factor;
        var height = imageObj.height * factor;
        image.setSize(width, height);
        image.setImage(imageObj)
        image.moveToTop();
        current_layer.draw()
    };
}



function listenForImageChoice()
{
    stage.add(current_layer);
    var con = stage.getContainer();    

    con.addEventListener('dragover',function(e){
        e.preventDefault(); //@important
    });

    var dragSrcEl = null;

    //image
    $(".char, .bg").on('dragstart',function(e){
           dragSrcEl = this;
    });

    // allow bg click
    $(".bg").on('click',function(e){
           dragSrcEl = this;
           changeBg(e, dragSrcEl);
    });
    
    //insert image to stage
    con.addEventListener('drop',function(e){
        if (dragSrcEl.className == 'char')
            addCharImg(e, dragSrcEl);
        else if (dragSrcEl.className == 'bg')
            changeBg(e, dragSrcEl);
    });
}

function repositionCanvas ()
{
  $("#canvas").css({
      left: -frame_offsetX,
      top: -frame_offsetY,
      position:'absolute'});
}

function drawBorders ()
{
    // for debugging purposes
    frame = new Kinetic.Rect({
        x: frame_offsetX,
        y: frame_offsetY,
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT,
        stroke: 'crimson',
        strokeWidth: 4
      });
     
     var border_stage = new Kinetic.Rect({
          x:0,
          y:0,
        width: stage.getWidth(),
        height: stage.getHeight(),
        stroke: 'black',
        strokeWidth: 4
      });
     

    // add the shape to the layer
    current_layer.add(border_stage);
    current_layer.add(frame);
}

function positionChars ()
{
    $(function () {
        var i = 0;
        $('#chars').children().each(function(){
            var offsetY = ($(this).parent().height() - $(this).height()) /2;
            $(this).css({left:$(this).position().left + i, top: offsetY});
            i = i + char_padding;
        });
    });
}

function positionBgs ()
{
    var i = 0;
    $('#bgs').children().each(function(){
        var offsetX = ($(this).parent().width() - $(this).width()) /2;
        var offsetY = $(this).position().top + i;
        $(this).css({left: offsetX, top: offsetY});
        i = i + bg_padding;
    });
}

function setUpShift()
{
    $("#shiftRight").on("click", function () {
        $('#chars').children().each(function(){
            $(this).css({left:$(this).position().left - char_padding });
        });
    });
    $("#shiftLeft").on("click", function () {
        $('#chars').children().each(function(){
            $(this).css({left:$(this).position().left + char_padding });
        });
    }); 
    $("#shiftDown").on("click", function () {
        $('#bgs').children().each(function(){
            $(this).css({top:$(this).position().top - bg_padding });
        });
    });
    $("#shiftUp").on("click", function () {
        $('#bgs').children().each(function(){
            $(this).css({top:$(this).position().top + bg_padding });
        });
    }); 
}

function getStyle(el,styleProp)
{
    if (el.currentStyle)
        return el.currentStyle[styleProp];

    return document.defaultView.getComputedStyle(el,null)[styleProp];
}

function goToLayer(num)
{
    for(var i=0; i < layer_array.length; i++) 
    {
        layer_array[i].hide();
    }
    layer_array[num].show();
    current_layer = layer_array[num];
    current_layer.draw();
    stage.draw();
}



function setUpHoverStyling()
{
    // NEED TO INVESTIGATE WHY THIS CAN NOT BE DONE    
    // for (var i = 0; i < sprite_map.length; i++)
    // {
    //     var scene = 'scene' + i;
    //     log(scene);
    //     if (getStyle(document.getElementById(scene), 'backgroundPosition') != sprite_map[i].sel)
    //     {
    //         $('#' + scene).on("mouseover", function (){log(i); this.style.backgroundPosition = sprite_map[i].hov;this.style.cursor = 'pointer';});
    //         $('#' + scene).on("mouseout", function (){this.style.backgroundPosition = sprite_map[i].std;});
    //     }
    // }

        $('#scene0').on("mouseover", function (){
            if (getStyle(document.getElementById('scene0'), 'backgroundPosition') != sprite_map[0].sel)
                this.style.backgroundPosition = sprite_map[0].hov; this.style.cursor = 'pointer';});
        $('#scene0').on("mouseout", function (){
            if (getStyle(document.getElementById('scene0'), 'backgroundPosition') != sprite_map[0].sel)
                this.style.backgroundPosition = sprite_map[0].std;});
        $('#scene0').on("click", function (){this.style.backgroundPosition = sprite_map[0].sel; 
            goToLayer(0);
            document.getElementById('scene1').style.backgroundPosition = sprite_map[1].std;
            document.getElementById('scene2').style.backgroundPosition = sprite_map[2].std;
            document.getElementById('scene3').style.backgroundPosition = sprite_map[3].std;
        });

        $('#scene1').on("mouseover", function (){
            if (getStyle(document.getElementById('scene1'), 'backgroundPosition') != sprite_map[1].sel)
                this.style.backgroundPosition = sprite_map[1].hov; this.style.cursor = 'pointer';});
        $('#scene1').on("mouseout", function (){
            if (getStyle(document.getElementById('scene1'), 'backgroundPosition') != sprite_map[1].sel)
                this.style.backgroundPosition = sprite_map[1].std;});
        $('#scene1').on("click", function (){this.style.backgroundPosition = sprite_map[1].sel; 
            goToLayer(1);
            document.getElementById('scene0').style.backgroundPosition = sprite_map[0].std;
            document.getElementById('scene2').style.backgroundPosition = sprite_map[2].std;
            document.getElementById('scene3').style.backgroundPosition = sprite_map[3].std;
        });

        $('#scene2').on("mouseover", function (){
            if (getStyle(document.getElementById('scene2'), 'backgroundPosition') != sprite_map[2].sel)
                this.style.backgroundPosition = sprite_map[2].hov; this.style.cursor = 'pointer';});
        $('#scene2').on("mouseout", function (){
            if (getStyle(document.getElementById('scene2'), 'backgroundPosition') != sprite_map[2].sel)
                this.style.backgroundPosition = sprite_map[2].std;});
        $('#scene2').on("click", function (){this.style.backgroundPosition = sprite_map[2].sel; 
            goToLayer(2);
            document.getElementById('scene0').style.backgroundPosition = sprite_map[0].std;
            document.getElementById('scene1').style.backgroundPosition = sprite_map[1].std;
            document.getElementById('scene3').style.backgroundPosition = sprite_map[3].std;
        });

        $('#scene3').on("mouseover", function (){
            if (getStyle(document.getElementById('scene3'), 'backgroundPosition') != sprite_map[3].sel)
                this.style.backgroundPosition = sprite_map[3].hov; this.style.cursor = 'pointer';});
        $('#scene3').on("mouseout", function (){
            if (getStyle(document.getElementById('scene3'), 'backgroundPosition') != sprite_map[3].sel)
                this.style.backgroundPosition = sprite_map[3].std;});
        $('#scene3').on("click", function (){
            this.style.backgroundPosition = sprite_map[3].sel;
            goToLayer(3);
            document.getElementById('scene0').style.backgroundPosition = sprite_map[0].std;
            document.getElementById('scene1').style.backgroundPosition = sprite_map[1].std;
            document.getElementById('scene2').style.backgroundPosition = sprite_map[2].std;
        });
}

function setUpRender ()
{
    document.getElementById('save').addEventListener('click', function() {
            /*
             * since the stage toDataURL() method is asynchronous, we need
             * to provide a callback
             */
            stage.toDataURL({
              callback: function(dataUrl) {
                /*
                 * here you can do anything you like with the data url.
                 * In this tutorial we'll just open the url with the browser
                 * so that you can see the result as an image
                 */
                window.open(dataUrl);
              }
            });
          }, false);
}

function makeStageAndLayers ()
{
    stage = new Kinetic.Stage({
        container: "canvas",
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT
      });
    for (var i = 0; i < NUM_SCENES; i ++)
    {
        var new_layer = new Kinetic.Layer();
        stage.add(new_layer);
        layer_array[i] = new_layer;
    }
}

function drawBgImages()
{
    for (var i =0; i < NUM_SCENES; i++ )
    {
        goToLayer(i);
        bg_images[i] = drawBgImage(bg_file_names[i]);
    }

}

var STAGE_WIDTH = 640*2;
var STAGE_HEIGHT = 240*2;
var FRAME_WIDTH = 640;
var FRAME_HEIGHT = 240;
var frame_offsetX = STAGE_WIDTH * 0.25;
var frame_offsetY = STAGE_HEIGHT * 0.25;
var char_padding = 60;
var bg_padding = 65;
var NUM_SCENES = 4;
var sprite_map = [
    {"sel":"-2px -199px", "hov":"-2px -159px", "std":"-2px -119px"},
    {"sel":"-114px -199px", "hov":"-114px -159px", "std":"-114px -119px"},
    {"sel":"-227px -199px", "hov":"-227px -159px", "std":"-227px -119px"},
    {"sel":"-341px -199px", "hov":"-341px -159px", "std":"-341px -119px"}];
var bg_images = [];
var layer_array = [];
var bg_file_names = ['images/bgs/blue.jpg', 'images/bgs/orange.jpg',
    'images/bgs/purple.jpg', 'images/bgs/green.jpg'];


window.onload = function(){
    // === SETUP CANVAS ===
    makeStageAndLayers();
    drawBgImages();
    goToLayer(0);

    repositionCanvas();
    // drawBorders();
    listenForImageChoice();
    goToLayer(0);


    // === SETUP IMAGE CHOICE NAVS ===
    positionChars();
    positionBgs();
    setUpShift();

    // === SETUP SCENE NAV ===
    setUpHoverStyling();



}


