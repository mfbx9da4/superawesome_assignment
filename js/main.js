function log(str)
{
  return console.log(str)
}


function drawBgImage(path_to_image)
{
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
        image.setName('bg');
        image.moveToBottom();
        current_layer.draw()
    };
}

function changeBg(e, srcEl)
{
    var children = current_layer.getChildren();
    for (var i = 0; i < children.length; i++)
    {
        if (children[i].getZIndex() === 0)
        {
            children[i].destroy()
        }
    }
    drawBgImage(srcEl.src)
}

function addCharImg(e, srcEl)
{
    var image = new Kinetic.Image({
            draggable : true,
            x: frame_offsetX + 10,
            y: frame_offsetY + 10,
            name : 'character',
            dragBoundFunc: function (pos) {
                var thisImg = this;
                var bound_loX = frame_offsetX ;
                var bound_hiX = frame_offsetX + FRAME_WIDTH - thisImg.getWidth();
                var bound_loY = frame_offsetY;
                var bound_hiY = frame_offsetY + FRAME_HEIGHT - thisImg.getHeight();
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
    imageObj.src = srcEl.src;
    imageObj.onload = function()
    {
        var width = imageObj.width * CHAR_SCALE_FACTOR;
        var height = imageObj.height * CHAR_SCALE_FACTOR;
        image.setSize(width, height);
        image.setImage(imageObj)
        image.moveToTop();
        current_layer.draw()
    };
}

function removeAllChars()
{
    var chars = current_layer.get('.character');
    chars.each( function (charImg){
        charImg.remove();
    });
    current_layer.draw();
}

function renderImages()
{
    var scene_imgs = $(".scene_image");
    for (var i = 0; i < NUM_SCENES; i++)
    {
        goToLayer(i);
        scene_imgs[i].src = current_layer.toDataURL();
    }

}

function assignHandlers()
{
    //bind clear canvas
    $("#clear").on('click', function(e){
        removeAllChars();
        changeTextArea(e, '');
    });
    
    //bind clear canvas
    $(".preview_open").on('click', function(e){
        renderImages();
    });

    //bind popup
    $('#preview').popup();

    stage.add(current_layer);
    var con = stage.getContainer();    

    con.addEventListener('dragover',function(e){
        e.preventDefault(); //@important
    });

    var srcEl = null;

    // bind bg and char drag
    $(".char, .bg").on('dragstart',function(e){
           srcEl = this;
    });

    // bind bg click
    $(".bg").on('click',function(e){
           srcEl = this;
           changeBg(e, srcEl);
    });
    
    //insert char to stage
    con.addEventListener('drop',function(e){
        if (srcEl.className == 'char')
            addCharImg(e, srcEl);
        else if (srcEl.className == 'bg')
            changeBg(e, srcEl);
    });

    // bind add text to stage
    $("#add_text").on('click',function(e){
           srcEl = this;
           var new_text = document.getElementById('story_input').value;
           changeTextArea(e, new_text);
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

function setUpShiftImageChoice()
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

function getStyle(el, styleProp)
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

function drawTextArea (scene_text)
{
    var rect = new Kinetic.Rect({
            x: frame_offsetX,
            y: frame_offsetY + FRAME_HEIGHT,
            width: FRAME_WIDTH,
            height: TEXT_AREA_HEIGHT,
            fill: 'black'
          });
         
        var text = new Kinetic.Text({
            x: frame_offsetX,
            y: frame_offsetY + FRAME_HEIGHT,
            width: FRAME_WIDTH,
            height: TEXT_AREA_HEIGHT,
            text: scene_text,
            fontSize: 15,
            fontFamily: 'Arial',
            fill: '#fff',
            padding: 14,
            align: 'left'
          });
        current_layer.add(rect);
        current_layer.add(text);
        current_layer.draw();
}

function drawTextAreas ()
{
    for (var i =0; i < NUM_SCENES; i++ )
    {
        goToLayer(i);
        var scene_text = (i == 0 ? "Only the best story will win the Grand Prize, so think about your story before you submit your scenes! Roughly 3 lines of text be displayed maximum. Only the best story will win the Grand Prize, so think about your story before you submit your scenes! Roughly 3 lines of text be displayed maximum." : "");
        drawTextArea(scene_text);
    }
}

function changeTextArea(e, new_text)
{
    var children = current_layer.getChildren();
    for (var i = 0; i < children.length; i++)
    {
        log(children[i].className)
        if (children[i].className == 'Text' || children[i].className == 'Rect')
        {
            children[i].destroy()
            log(children)
        }
    }
    drawTextArea(new_text)
}

function loadAndPositionChars()
{
    var chars = $('.char');
    j = 0;
    for (var i = 0; i < chars.length; i ++)
    {
        chars[i].src = char_file_names[i];
        log(chars[i]);
        chars[i].onload = function ()
        {
            var offsetY = ($(this).parent().height() - $(this).height()) /2;
            $(this).css({left:$(this).position().left + j, top: offsetY, visibility: 'visible'});
            j = j + char_padding;
        }
    }
}


var CHAR_SCALE_FACTOR = 0.07;
var FRAME_WIDTH = 640;
var FRAME_HEIGHT = 240;
var TEXT_AREA_HEIGHT = 80;
var STAGE_WIDTH = FRAME_WIDTH;
var STAGE_HEIGHT = FRAME_HEIGHT + TEXT_AREA_HEIGHT;
var frame_offsetX = 0;
var frame_offsetY = 0;
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
var bg_file_names = ['/images/bgs/blue.jpg', '/images/bgs/orange.jpg',
    '/images/bgs/purple.jpg', '/images/bgs/green.jpg'];
var char_file_names = [
    '/images/chars/Syndrome.png',
    '/images/chars/Mike.png',
    '/images/chars/Edna.png',
    '/images/chars/DavyJones.png',
    '/images/chars/Barbosa.png',
    '/images/chars/Holly.png',
    '/images/chars/LoneRanger.png',
    '/images/chars/JackSkellington.png',
    '/images/chars/Bob_Flying.png',
    '/images/chars/Ralph.png',
    '/images/chars/Buzz.png',
    '/images/chars/Mater.png',
    '/images/chars/Dash.png',
    '/images/chars/CaptainJack.png',
    '/images/chars/Helen.png',
    '/images/chars/Phineas.png',
    '/images/chars/Francesco.png',
    '/images/chars/Violet_2.png',
    '/images/chars/Jessie.png',
    '/images/chars/Perry.png',
    '/images/chars/Gibbs.png',
    '/images/chars/Woody.png',
    '/images/chars/Sully.png',
    '/images/chars/Tonto.png',
    '/images/chars/McQueen.png']

window.onload = function(){

    // === SETUP CANVAS ===
    makeStageAndLayers();
    drawBgImages();
    drawTextAreas();
    repositionCanvas();
    assignHandlers();
    // drawBorders();

    goToLayer(0);


    // === SETUP IMAGE CHOICE NAVS ===
    loadAndPositionChars();
    positionBgs();
    setUpShiftImageChoice();

    // === SETUP SCENE NAV ===
    setUpHoverStyling();



}


