$(function()
{
   
//  ------------------------------------------------PHASES--------------------------------------------------------------------------------------- //
function init()
{
   var transition = function()
           {
           $startBtnContainer.remove();
           $startTileContainer.removeClass('reallyHidden').css('z-index', '0');
           };
   
   $mainPage.addClass('reallyHidden');
   $startTileContainer.addClass('reallyHidden');
   
   $leftPanel.data( {'school' : 'noschool', 'oldschool' : ''} );
   $midPanel.data( {'school' : 'noschool', 'oldschool' : ''} );
   $rightPanel.data( {'school' : 'noschool', 'oldschool' : ''} );
   
   $leftPanelContainer.data( {'school' : 'noschool', 'oldschool' : ''} );
   $midPanelContainer.data( {'school' : 'noschool', 'oldschool' : ''} );
   $rightPanelContainer.data( {'school' : 'noschool', 'oldschool' : ''} );
   
   $(window).on('resize', function()
       {
       var $this = $(this);
       if($this.width() >= 992 && !(panelsActivated))
               {
               $Panels.css(
                           {
                             "width" : "33.33333333%",
                             "height" : "100%"
                           })
               $buttonPanel.css( {"height" : "100%"} );
               relLeftPos = [$leftPanelContainer.offsetLeft, $leftPanelContainer.offsetTop];
               relMidPos = [$midPanelContainer.offsetLeft, $midPanelContainer.offsetTop];
               relRightPos = [$rightPanelContainer.offsetLeft, $rightPanelContainer.offsetTop];

               }
       else if($this.width() < 992 && !(panelsActivated))
               {
               $Panels.css(
                           {
                             "height" : "33.33333333%",
                             "width" : "100%"
                           })
               $buttonPanel.css( {"width" : "100%"} );
               }
       });
   
   $startBtn.on('click', function()
     {
     transition();
     $startHeader.html('Select 3 Schools To Begin');
     phaseChooseThree();
     });
}

function phaseChooseThree()
{
   var transition = function()
      {
      $startPage.remove();
      $mainPage.removeClass('reallyHidden').css('z-index', '0');
      };
   var btnPool = [];

   
   $startTiles.on('click', function()
     {
     var $this = $(this);
     var name = this.classList.item(1);

     if($this.hasClass('buttonSelected'))
           {
           btnPool.splice($.inArray(name, btnPool), 1);
           $this.toggleClass('buttonSelected');
           }
           
     else if(btnPool.length >= 0 && btnPool.length < 3 &&
     !($this.hasClass('buttonSelected')) )
           {
           btnPool.push(name);
           $this.toggleClass('buttonSelected');
           }
           if(btnPool.length > 2)
           {
           transition();
           phaseMainApp(btnPool);
           return;
           }
     });
}

function phaseMainApp(btnPool)
{
   $mainPage.find('.' + btnPool[0] + ',' +
                      '.' + btnPool[1] + ',' +
                      '.' + btnPool[2]).toggleClass('buttonSelected');
   panelPool = btnPool.slice();
   updatePanels();
   mainAppEvents(btnPool);
   
  
}
    

function mainAppEvents(btnPool)
{

   $mainButtons.on('click', function()
       {
       if(!panelsActivated)
           {
               var $this = $(this);
               var name = this.classList.item(1);
               var noschoolFilter;

               if($this.hasClass('buttonSelected'))
                     {
                     $this.removeClass('buttonSelected');
                     btnPool.splice($.inArray(name, btnPool), 1);
                     panelPool.splice($.inArray(name, panelPool), 1, 'noschool');
                     }
               else if(btnPool.length >= 0 && btnPool.length < 4 &&
               !($this.hasClass('buttonSelected')) )
                     {
                     $this.addClass('buttonSelected');
                     btnPool.push(name);
                     if($.grep(panelPool, function(item){return item !== 'noschool'}).length < 3)
                        { panelPool.splice($.inArray('noschool', panelPool), 1, name); }
               
                     if(btnPool.length > 3)
                         {
                         var removed = btnPool.shift();
                         $mainButtons.filter('.' + removed).removeClass('buttonSelected');
                         panelPool.splice($.inArray(removed, panelPool), 1, name);
                         console.log(panelPool[0] + ' = 1 ' + panelPool[1] + ' = 2' +  panelPool[2] + ' = 3');
                         }
                     }
                updatePanels();
            }
        });
    
          
   $Panels.on('click', clickedPanel);
}
//  ------------------------------------------------END PHASES--------------------------------------------------------------------------------------- //
    
//  ------------------------------------------------ANIMATIONS--------------------------------------------------------------------------------------- //
function changePanels(clicked)
{
    relLeftPos = [$Panels[0].offsetLeft, $Panels[0].offsetTop];
    relMidPos = [$Panels[1].offsetLeft, $Panels[1].offsetTop];
    relRightPos = [$Panels[2].offsetLeft, $Panels[2].offsetTop];
    defineAnimations(relLeftPos, relMidPos, relRightPos);
    var i, prop, val, begin, end, interim;
 
    var isMobile = ($(window).width() >= 992) ? false : true;
    
    var notclicked = [];
    
    $Panels.children().empty();
    
    function animClickedInterim()   // TRIGGER CLICKED INTERIM ON LEFT/RIGHT
            {
                
                if(animations[clicked.id].clicked.interim)
                    {
                        $(this).off('transitionend', animClickedInterim)
                               .on('transitionend', animClickedEnd);

                                   //  LOOP THROUGH BEGIN PROPS AND APPLY
                        interim = animations[clicked.id].clicked.interim;

                        for(i = 0; i < interim.length; i++)
                            {
                            prop = interim[i][0];
                            val = interim[i][1];
                              
                            if(isMobile) { prop = mobile(prop); val = mobile(val); }
                            
                            this.style[prop] = val;
                            }
                    }
                else
                    {
                        $(this).off('transitionend', animClickedInterim);
                
                                       //  LOOP THROUGH BEGIN PROPS AND APPLY
                        end = animations[clicked.id].clicked.end;

                        for(i = 0; i < end.length; i++)
                            {
                            prop = end[i][0];
                            val = end[i][1];
                              
                            if(isMobile) { prop = mobile(prop); val = mobile(val); }
                              
                            this.style[prop] = val;
                            }
                        
                        // POPULATE CLICKED PANEL WITH SCHOOL INFO WHEN FINISHED ANIMATING
                         updateInfoContainer(clicked);
                        $bottomRowSection.on('click', animRevertPanels)
                console.log('go back button ready for middle');
                        
                    }
                
                
            }
    function animClickedEnd()   // ---------------------CLICKED / END / TRIGGERS FROM TRANSITIONEND INTERIM LEFT + RIGHT
            {                                                        // TRIGGERS FROM TRANSITIONEND BEGIN MIDDLE
                $(this).off('transitionend', animClickedEnd);
                
                              //  LOOP THROUGH BEGIN PROPS AND APPLY
                end = animations[clicked.id].clicked.end;
                
                for(i = 0; i < end.length; i++)
                    {
                    prop = end[i][0];
                    val = end[i][1];
                      
                    if(isMobile) { prop = mobile(prop); val = mobile(val); }
                      
                    clicked.style[prop] = val;
                    }
                
                // POPULATE CLICKED PANEL WITH SCHOOL INFO WHEN FINISHED ANIMATING
              setTimeout(function()
                         {
                            
                             updateInfoContainer(clicked);
                             $bottomRowSection.on('click', animRevertPanels)
                    
                         }, 100);
               
                console.log('go back button ready for left/right');
            }
            
    function animNotClickedEnd()        // --------------------- NOT CLICKED 1 + 2 / END / TRIGGERS FROM TRANSITIONEND INTERIM----------------
            {
                $(this).off('transitionend', animNotClickedEnd);
                
                                      //  LOOP THROUGH BEGIN PROPS AND APPLY
                
                if(animations[this.id].notclicked.leftclicked)
                    { end = animations[this.id].notclicked[clicked.id + 'clicked'].end; }
                else
                    { end = animations[this.id].notclicked.end; }
                
                for(i = 0; i < end.length; i++)
                    {
                    prop = end[i][0];
                    val = end[i][1];
                      
                    if(isMobile) { prop = mobile(prop); val = mobile(val); }
                      
                    this.style[prop] = val;
                    }
                $(this).addClass('hidden');
                
                
            }
    
    function animButtonsEnd()
            {
                $(this).off('transitionend', animButtonsEnd);
                $(this).addClass('hidden');
                $bottomRowSection.append('<div id="arrow">Return</div>').addClass('shade');
                
                $bottomRowSection.find('#arrow')
                                .css({ 'transform' : 'scale(0)',
                                        'opacity' : '0'
                                     });
                setTimeout(function()                   // ---------ARROW ANIM START------------------
                           {
                           $bottomRowSection.find('#arrow')
                                .css({
                                            'transition' : 'all 750ms ease',
                                             'opacity' : '1',
                                             'transform' : ''
                                     }).on('transitionend', animArrowEnd);
            
                           }, 10)
            }
    function animArrowEnd()         // -------- ARROW END / TRIGGERS FROM TRANSITION END
            {
                $(this).off('transitionend', animArrowEnd)
                $bottomRowSection.find('#arrow')
                                .css({
                                        'transition' : '',
                                     });
            }
    
    function animRevertPanels()
            {
                $(this).off('click', animRevertPanels);
                
                //  ---------CLEAR CLICKED PANEL----------------
                clicked.children[0].innerHTML = '';
                
                
                //  -----------------------REVERT / NOT CLICKED 1 / SET TIMEOUT INTERIM-------------------------
                console.log('not clicked 1 reverting');
                if(animations[notclicked[0].id].revert.ifnotclicked.rightclicked)
                    { begin = animations[notclicked[0].id].revert.ifnotclicked[clicked.id + 'clicked'].begin;
                      interim = animations[notclicked[0].id].revert.ifnotclicked[clicked.id + 'clicked'].interim; }
                else
                    { begin = animations[notclicked[0].id].revert.ifnotclicked.begin;
                      interim = animations[notclicked[0].id].revert.ifnotclicked.interim;}
                
                $(notclicked[0]).removeClass('hidden');
                for(i = 0; i < begin.length; i++)
                    {
                    prop = begin[i][0];
                    val = begin[i][1];
                      
                    if(isMobile) { prop = mobile(prop); val = mobile(val); }
                      
                    notclicked[0].style[prop] = val;
                    }
                setTimeout(function()
                           {
                           for(i = 0; i < interim.length; i++)
                                {
                                prop = interim[i][0];
                                val = interim[i][1];
                                  
                                if(isMobile) { prop = mobile(prop); val = mobile(val); }
                                  
                                notclicked[0].style[prop] = val;
                                }
                           $(notclicked[0]).on('transitionend', animRevertNotClickedEnd);
                           }, 100);
                
                
                //  ------------------REVERT / NOT CLICKED 2 / BEGIN / SET TIMEOUT INTERIM -----------------
                console.log('not clicked 2 reverting');
                if(animations[notclicked[1].id].revert.ifnotclicked.rightclicked)
                    { begin = animations[notclicked[1].id].revert.ifnotclicked[clicked.id + 'clicked'].begin;
                      interim = animations[notclicked[1].id].revert.ifnotclicked[clicked.id + 'clicked'].interim; }
                else
                    { begin = animations[notclicked[1].id].revert.ifnotclicked.begin;
                      interim = animations[notclicked[1].id].revert.ifnotclicked.interim;  }
                
                $(notclicked[1]).removeClass('hidden');
                for(i = 0; i < begin.length; i++)
                    {
                    prop = begin[i][0];
                    val = begin[i][1];
                      
                    if(isMobile) { prop = mobile(prop); val = mobile(val); }
                      
                    notclicked[1].style[prop] = val;
                    }
                setTimeout(function()
                           {
                
                           for(i = 0; i < interim.length; i++)
                                {
                                prop = interim[i][0];
                                val = interim[i][1];
                                  
                                if(isMobile) { prop = mobile(prop); val = mobile(val); }
                                  
                                notclicked[1].style[prop] = val;
                                }
                           $(notclicked[1]).on('transitionend', animRevertNotClickedEnd);
                           }, 100);
                
                
                
                
                // ---------------- REVERT / CLICKED / BEING / SET TIMEOUT INTERIM------------------------
                
                begin = animations[clicked.id].revert.ifclicked.begin;
                
                for(i = 0; i < begin.length; i++)
                    {
                    prop = begin[i][0];
                    val = begin[i][1];
                      
                    if(isMobile) { prop = mobile(prop); val = mobile(val); }
                      
                    clicked.style[prop] = val;
                    }
                setTimeout(function()
                           {
                    
                           interim = animations[clicked.id].revert.ifclicked.interim;
                
                           for(i = 0; i < interim.length; i++)
                                {
                                prop = interim[i][0];
                                val = interim[i][1];
                                  
                                if(isMobile) { prop = mobile(prop); val = mobile(val); }
                                  
                                clicked.style[prop] = val;
                                
                    console.log('clicked interim styles');
                                }
                           $(clicked).on('transitionend', animRevertClickedEnd);
                    
                console.log('after assigning transition end');
                           }, 100);
                
                $bottomRowSection.removeClass('shade').find('#arrow')
                            .css({    'transition' : 'all 750ms ease',
                                      'opacity' : '0',
                                      'transform' : 'scale(0)'
                                  }).on('transitionend', animRevertButtonsEnd);
                
            }
    
    function animRevertClickedEnd()     //  ----------------REVERT / CLICKED / END-----------------------
            {                                        //------------TRIGGERS FROM TRANSITIONEND INTERIM----------------------
                console.log('clicked revert ended');
                $(this).off('transitionend', animRevertClickedEnd);
                
                end = animations[this.id].revert.ifclicked.end;
                
                for(i = 0; i < end.length; i++)
                    {
                    prop = end[i][0];
                    val = end[i][1];
                      
                    if(isMobile) { prop = mobile(prop); val = mobile(val); }
                      
                    clicked.style[prop] = val;
                    }
                
                //  TURN PANELS BACK ON
              setTimeout(function()
                        {
                            $bottomRowSection.off('click', animRevertPanels);
                            $Panels.on('click', clickedPanel);
                            panelsActivated = false;
                            updatePanels();
                
                        },100);
                
                
            }
    
    function animRevertButtonsEnd() //  ----------------REVERT /  BUTTON PANEL-----------------------
            {                                       //  --------------TRIGGERS FROM TRANSITIONEND --------------
                $(this).off('transitionend', animRevertButtonsEnd);
                console.log('revert buttons remove arrow');
                $buttonPanel.removeClass('hidden');
                if(isMobile)
                  {
                      $buttonPanel.css({    'transition' : 'all 750ms ease',
                                'opacity' : '1',
                                'transform' : 'scaleX(1)'
                            });
                  }
                else
                {
                  $buttonPanel.css({    'transition' : 'all 750ms ease',
                                'opacity' : '1',
                                'transform' : 'scaleY(1)'
                            });
                }
                $bottomRowSection.find('#arrow').remove();
            }
    
    function animRevertNotClickedEnd()  //  ----------------REVERT / NOT CLICKED 1+2 / END-----------------------
            {                                       //  -------------TRIGGERS FROM TRANSITIONEND INTERIM---------------
                console.log('not clicked revert ended');
                $(this).off('transitionend', animRevertNotClickedEnd);
                 if(animations[this.id].revert.ifnotclicked.rightclicked)
                    { end = animations[this.id].revert.ifnotclicked[clicked.id + 'clicked'].end; }
                else
                    { end = animations[this.id].revert.ifnotclicked.end; }
                
                for(i = 0; i < end.length; i++)
                    {
                    prop = end[i][0];
                    val = end[i][1];
                      
                    if(isMobile) { prop = mobile(prop); val = mobile(val); }
                      
                    this.style[prop] = val;
                    }
            }
       
        
       if(clicked.id === 'left')
            { notclicked.push($Panels[1]);
              notclicked.push($Panels[2]); }

       else if(clicked.id === 'middle')
            { notclicked.push($Panels[0]);
              notclicked.push($Panels[2]); }

       else if(clicked.id === 'right')
            { notclicked.push($Panels[0]);
              notclicked.push($Panels[1]); }
  
  function mobile(str)
  {
    var newstr;
    if(str.includes('width')) { newstr = str.replace(/width/g, 'height'); }
    else if(str.includes('height')) { newstr = str.replace(/height/g, 'width'); }
    
    else if(str.includes('X')) { newstr = str.replace(/X/g, 'Y'); }
    else if(str.includes('Y')) { newstr = str.replace(/Y/g, 'X'); }
    else{ newstr = str; }
    return newstr;
  }

        //if($(window).width() >= 992)  // DESKTOP VERSION
            
            
                                       
                   //------------------------------- FOR CLICKED PANEL   --------------------------------------
                                           //  LOOP THROUGH BEGIN PROPS AND APPLY  //   [0] = prop, [1] = value
                begin = animations[clicked.id].clicked.begin;
                for(i = 0; i < begin.length; i++)
                    {
                    prop = begin[i][0];
                    val = begin[i][1];
                      
                    if(isMobile) { prop = mobile(prop); val = mobile(val); }
                      
                    clicked.style[prop] = val;
                    }
                                //  TRIGGER INTERIM AFTER BEGIN FINISHES
                  
                 $(clicked).on('transitionend', animClickedInterim);
                    
                
                    
                   
                   //------------------- FOR NON-CLICKED PANELS------------------------------
                            // IF MIDDLE, SET BEGIN TO LEFT OR RIGHT BEGIN ANIMATIONS
                if(animations[notclicked[0].id].notclicked.leftclicked)
                    { begin = animations[notclicked[0].id].notclicked[clicked.id + 'clicked'].begin; }
                else
                    { begin = animations[notclicked[0].id].notclicked.begin; }
                   
                for(i = 0; i < begin.length; i++)
                    {
                    prop = begin[i][0];
                    val = begin[i][1];
                      
                    if(isMobile) { prop = mobile(prop); val = mobile(val); }
                      
                    notclicked[0].style[prop] = val;
                    }
                
                
                        // ------------------SECOND NON-CLICKED PANEL SAME THING -------------------
                    if(animations[notclicked[1].id].notclicked.leftclicked)
                        { begin = animations[notclicked[1].id].notclicked[clicked.id + 'clicked'].begin;  }
                    else
                        { begin = animations[notclicked[1].id].notclicked.begin; }

                    for(i = 0; i < begin.length; i++)
                        {
                        prop = begin[i][0];
                        val = begin[i][1];
                          
                        if(isMobile) { prop = mobile(prop); val = mobile(val); }
                          
                        notclicked[1].style[prop] = val;
                        }
                
                
                
                    //-----------------------BUTTON PANEL ANIMATION START----------------------------
                $(notclicked[0]).add(notclicked[1]).on('transitionend', animNotClickedEnd);
                
  
                if(isMobile)
                  {
                    $buttonPanel.css({
                                      'transition' : 'all 750ms ease',
                                      'opacity' : '0',
                                      'transform' : 'scaleX(0) translateX(100%)'
                                  }).on('transitionend', animButtonsEnd);
                  }
                else
                {
                  $buttonPanel.css({
                                        'transition' : 'all 750ms ease',
                                        'opacity' : '0',
                                        'transform' : 'scaleY(0) translateY(100%)'
                                    }).on('transitionend', animButtonsEnd);
                }

                                  
             
             
}
    
//  ------------------------------------------------END ANIMATIONS--------------------------------------------------------------------------------------- //


  
function changeBackground(clicked)
{
   try{
    if(!(panelsActivated))
        {
        var school = $(clicked).data('school');
        $background.css({
                            'background-image' : 'url(pics/' + school + '_BG.jpg)',
                            'background-size' : 'cover',
                            'background-repeat' : 'no-repeat',
                            'background-position' : 'center',
                            'background-attachment' : 'fixed'
                        });
        
        $photoCredit.attr('href', photoLinks[school][0]).html('Photo By: ' + photoLinks[school][1]);
            
        }
   }
    catch(e)
        {console.log(e.message);}
}

function clickedPanel()
{
    if($(this).data('school') === 'noschool')
        {
            
        }
    else
        {
            changeBackground(this);
            $Panels.off('click', clickedPanel);
            console.log('panels on');
            panelsActivated = true;
           
            
            
            changePanels(this);
        }
}


function updateInfoContainer(clicked)
{
    $clicked = $(clicked);
    
    var i, j, schoolData, infoClone, infoContainer,
        infoSchoolGeneral, infoHeader, infoReco,
        infoTiles, curSubject, curBody, labelClone,
        curBodyNum, curBodyText, curBodyInput, hasOr,
        curSubjectName, label;

    if($clicked.data('school') === 'noschool')
         {

         }
    else
         {
         if($clicked.data('school') === 'WSU')
                { schoolData = data/*.responseJSON*/[$clicked.data('school')].campus.WSUP }
             else
                { schoolData = data/*.responseJSON*/[$clicked.data('school')]; }
             
             infoClone = infoTemplate.cloneNode(true);
              
             infoContainer = infoClone.childNodes[0];
                 
             infoSchoolGeneral = infoContainer.children[0].children[0].children[0];
          //   infoSchoolGeneral.children[0];

             infoHeader = [schoolData.abrev,
                            schoolData.full,
                            'Credits: ' + schoolData.minCredits];
                 
             for(i = 0; i < 3; i++) { infoSchoolGeneral.children[i].innerHTML = infoHeader[i]; }
             
             infoReco = infoContainer.children[0].children[1].children[0].children[0];
             infoReco.innerHTML =  schoolData.reco;
                 
              
             infoTiles = [ [], [] ];    // ARRAY 1 HOLDS TILE OBJECTS | ARRAY 2 HOLDS SUBJECT KEY ("QUA")
                 
             for(i = 0; i < 4; i++)
                {
                for(j = 0;j < 2; j++)   // PUSHES ITEMS INTO ARRAYS ABOVE
                    {
                    infoTiles[0].push(infoContainer.children[1].children[i].children[j]);
                    infoTiles[1].push(infoContainer.children[1].children[i].children[j].classList[2]);
                    }
                }
              
             for(i = 0; i < 8; i++)     //  FOR EACH TILE MODIFY IT
                 {
                     curSubjectName = infoTiles[1][i];
                     curSubject = schoolData.reqs[curSubjectName];
                     curBody = infoTiles[0][i].children[1];
                     
                     infoTiles[0][i].children[0].children[0]       // SET SUBJECT CREDITS TO TILE HEADERS
                                 .children[0].children[0].innerHTML = curSubject.credits;
                     
                     if(curSubject.credits.length > 2)
                         { infoTiles[0][i].children[0].children[0].children[0].children[0].style.fontSize = '0.7em'; }
                     
                                                                // SET SUBJECT NAME TO TILE HEADERS
                     infoTiles[0][i].children[0].children[1].innerHTML = curSubject.full;
                     
                    
                     
                     hasOr = false;
                                       //   LOOP THROUGH SUBJECT CLASSES AND APPEND LABEL CHUNKS
                     for(j = 0; j < curSubject.classes.length; j++)
                         {
                         if( !(curSubject.classes[j].hasOwnProperty('abrev1')) )
                             {              // IF SINGLE CLASS (NOT BUNDLED) APPLY NORMAL LABEL CHUNK
                             labelClone = labelTemplate1.cloneNode(true);
                             label = labelClone.childNodes[0];
                                 // INTERNET EXPLORER DOESNT HAVE CHILDREN PROPERTY OF DOCUMENT FRAGMENTS, HAVE TO USE CHILDNODES
                             curBodyInput = label.children[0];
                             curBodyNum = label.children[2].children[0].children[0].children[0];
                             curBodyText = label.children[2].children[1];
                                 
                             if(hasOr)  //  IF PREVIOUS CLASS HAD OR APPLY RADIO
                                     {
                                     hasOr = false;
                                     label.for = curSubjectName + '-' + j;
                                     curBodyInput.id = curSubjectName + '-' + j;
                                     curBodyInput.type = 'radio';
                                     curBodyInput.name = curSubjectName;
                                     }      // IF THIS CLASS HAS OR APPLY RADIO, AND OR FOR NEXT CLASS
                             else if(curSubject.classes[j].hasOwnProperty('or'))
                                     {
                                     hasOr = true;
                                     label.for = curSubjectName + '-' + j;
                                     curBodyInput.id = curSubjectName + '-' + j;
                                     curBodyInput.type = 'radio';
                                     curBodyInput.name = curSubjectName;
                                     }
                             else       // IF NO OR APPLY REQUIRED CHECKBOX
                                     {
                                     label.for = curSubjectName + '-REQ-' + j;
                                     label.title = 'REQUIRED';
                                     curBodyInput.id = curSubjectName + '-REQ-' + j;
                                     curBodyInput.type = 'checkbox';
                                     curBodyInput.name = curSubjectName;
                                     curBodyInput.disabled = true;
                                     curBodyInput.checked = true;
                                     }
                             // FILL TILE BODY WITH TEXT
                             curBodyNum.innerHTML = curSubject.classes[j].credits;
                             curBodyText.children[0].innerHTML = curSubject.classes[j].abrev;
                             if(curSubject.classes[j].full !== '')
                                { curBodyText.children[1].innerHTML = curSubject.classes[j].full; }
                             else
                                 { curBodyText.removeChild(curBodyText.children[1]); }
                             
                             curBody.appendChild(labelClone);
                             }
                         else       //  IF BUNDLED CLASSES APPLY LABEL 2 CHUNK
                             {
                             labelClone = labelTemplate2.cloneNode(true);
                             label = labelClone.childNodes[0];
                             curBodyInput = label.children[0];
                                 
                             curBodyNum = label.children[2].children[0]
                                                    .children[0].children[0].children[0];
                                 
                             if(hasOr)  //  IF PREVIOUS CLASS HAD OR APPLY RADIO
                                     {
                                     hasOr = false;
                                     label.for = curSubjectName + '-' + j;
                                     curBodyInput.id = curSubjectName + '-' + j;
                                     curBodyInput.type = 'radio';
                                     curBodyInput.name = curSubjectName;
                                     }      // IF THIS CLASS HAS OR APPLY RADIO, AND OR FOR NEXT CLASS
                             else if(curSubject.classes[j].hasOwnProperty('or'))
                                     {
                                     hasOr = true;
                                     label.for = curSubjectName + '-' + j;
                                     curBodyInput.id = curSubjectName + '-' + j;
                                     curBodyInput.type = 'radio';
                                     curBodyInput.name = curSubjectName;
                                     }
                             else       // IF NO OR APPLY REQUIRED CHECKBOX
                                     {
                                     label.for = curSubjectName + '-REQ-' + j;
                                     label.title = 'REQUIRED';
                                     curBodyInput.id = curSubjectName + '-REQ-' + j;
                                     curBodyInput.type = 'checkbox';
                                     curBodyInput.name = curSubjectName;
                                     curBodyInput.disabled = true;
                                     curBodyInput.checked = true;
                                     }
                             // FILL TILE BODY WITH TEXT
                             curBodyNum.innerHTML = curSubject.classes[j].credits;
                                 
                             curBodyText = label.children[2].children[0].children[1];
                             curBodyText.children[0].innerHTML = curSubject.classes[j].abrev1;
                             if(curSubject.classes[j].full !== '')
                                { curBodyText.children[1].innerHTML = curSubject.classes[j].full; }
                             else
                                { curBodyText.removeChild(curBodyText.children[1]); }
                                 
                             curBodyText = label.children[2].children[1].children[1];
                             curBodyText.children[0].innerHTML = curSubject.classes[j].abrev2;
                             
                             if(curSubject.classes[j].full !== '')
                                { curBodyText.children[1].innerHTML = curSubject.classes[j].full; }
                             else
                                { curBodyText.removeChild(curBodyText.children[1]); }
                              
                             curBody.appendChild(labelClone);
                             }
                         }
                 
                 }
         }
         $(infoClone).find('label:has(input[type=radio])').css('animation', 'pulse 4s ease infinite');
         if(clicked.id === 'left')
             {
             $leftPanel.empty().append(infoClone);
             }
         else if(clicked.id === 'middle')
             {
             $midPanel.empty().append(infoClone);
             }
         else if(clicked.id === 'right')
             {
             $rightPanel.empty().append(infoClone);
             }
    
                     
}
             
                 
             
                 
      
                 
             
  
function updatePanels()
{
   var leftCur = $leftPanel.data('school');
   var midCur = $midPanel.data('school');
   var rightCur = $rightPanel.data('school');
    
   var schoolData, briefClone, briefPanel, briefHeader,
       briefItems, briefItemsContent, noSchoolClone, i;
    
   var classOrder = ['MAJ', 'QUA', 'SOC', 'NAT', 'HUM', 'COM', 'UNI', 'ELE'];
 
   if(leftCur !== panelPool[0] || $leftPanel.html() === '')
         {
         $leftPanel.data('oldschool', leftCur);
         $leftPanel.data('school', panelPool[0])
                   .addClass(panelPool[0] + '-panel');
         
         $leftPanelContainer.data('oldschool', leftCur);
         $leftPanelContainer.data('school', panelPool[0]);
                            //.addClass(panelPool[0] + '-panel-container');
             
             // content update
         if(panelPool[0] === 'noschool')
             {
             noSchoolClone = noSchoolTemplate.cloneNode(true);
             $leftPanel.empty().append(noSchoolClone);
             }
         else if (panelPool[0])
             {
             schoolData = data/*.responseJSON*/[panelPool[0]];
             briefClone = briefTemplate.cloneNode(true);
              
             briefPanel = briefClone.childNodes[0];
             
                 
             briefHeader = [schoolData.abrev,
                            schoolData.full,
                            'Credits: ' + schoolData.minCredits];
                 
             if(panelPool[0] === 'WSU') { schoolData = data/*.responseJSON*/[panelPool[0]].campus.WSUP }
                 
             briefItems = briefPanel.children[3].children;
             briefItemsContent = [ [], [] ];
             
                 
             for(i = 0; i < 8; i++) { briefItemsContent[1].push(schoolData.reqs[classOrder[i]].credits);
                                      briefItemsContent[0].push(schoolData.reqs[classOrder[i]].full); }
                 
             for(i = 0; i < 3; i++) { briefPanel.children[i].innerHTML = briefHeader[i]; }

             for(i = 0; i < 4; i++) { briefItems[0].children[i].children[0].innerHTML = briefItemsContent[0][i];
                                      briefItems[0].children[i].children[1].innerHTML = briefItemsContent[1][i]; }
               
             for(i = 0; i < 3; i++) { briefItems[1].children[i].children[0].innerHTML = briefItemsContent[0][i+4];
                                      briefItems[1].children[i].children[1].innerHTML = briefItemsContent[1][i+4]; }
//              for(i = 0; i < 8; i++) { briefItems[i].children[0].innerHTML = briefItemsContent[0][i];
//                                       briefItems[i].children[1].innerHTML = briefItemsContent[1][i]; }
                 
             if(schoolData.reco !== "") { briefItems[1].children[3].innerHTML = 'Has university recommendations'; }
             else { briefItems[1].children[3].innerHTML = 'No recommendations'; }
                 
             briefItems[2].innerHTML = 'Click for more details!';
             $leftPanel.empty().append(briefClone);
             }
         }
         
   if(midCur !== panelPool[1] || $midPanel.html() === '')
         {
         $midPanel.data('oldschool', midCur);
         $midPanel.data('school', panelPool[1]);
                  //.addClass(panelPool[1] + '-panel');
         
         $midPanelContainer.data('oldschool', midCur);
         $midPanelContainer.data('school', panelPool[1])
                           .addClass(panelPool[1] + '-panel-container');
         // content update
         if(panelPool[1] === 'noschool')
             {
             noSchoolClone = noSchoolTemplate.cloneNode(true);
             $midPanel.empty().append(noSchoolClone);
             }
         else if (panelPool[1])
             {
             schoolData = data/*.responseJSON*/[panelPool[1]];
             briefClone = briefTemplate.cloneNode(true);
              
             briefPanel = briefClone.childNodes[0];
             
                 
             briefHeader = [schoolData.abrev,
                            schoolData.full,
                            'Credits: ' + schoolData.minCredits];
                 
             if(panelPool[1] === 'WSU') { schoolData = data/*.responseJSON*/[panelPool[1]].campus.WSUP }
                 
             briefItems = briefPanel.children[3].children;
                            //briefItems = briefPanel.children[3].children;
             briefItemsContent = [ [], [] ];
             
                 
             for(i = 0; i < 8; i++) { briefItemsContent[1].push(schoolData.reqs[classOrder[i]].credits);
                                      briefItemsContent[0].push(schoolData.reqs[classOrder[i]].full); }
                 
             for(i = 0; i < 3; i++) { briefPanel.children[i].innerHTML = briefHeader[i]; }

             for(i = 0; i < 4; i++) { briefItems[0].children[i].children[0].innerHTML = briefItemsContent[0][i];
                                      briefItems[0].children[i].children[1].innerHTML = briefItemsContent[1][i]; }
               
             for(i = 0; i < 3; i++) { briefItems[1].children[i].children[0].innerHTML = briefItemsContent[0][i+4];
                                      briefItems[1].children[i].children[1].innerHTML = briefItemsContent[1][i+4]; }
//              for(i = 0; i < 8; i++) { briefItems[i].children[0].innerHTML = briefItemsContent[0][i];
//                                       briefItems[i].children[1].innerHTML = briefItemsContent[1][i]; }
                 
             if(schoolData.reco !== "") { briefItems[1].children[3].innerHTML = 'Has university recommendations'; }
             else { briefItems[1].children[3].innerHTML = 'No recommendations'; }
                 
             briefItems[2].innerHTML = 'Click for more details!';
             $midPanel.empty().append(briefClone);
             }
         }
         
   if(rightCur !== panelPool[2] || $rightPanel.html() === '')
         {
         $rightPanel.data('oldschool', rightCur);
         $rightPanel.data('school', panelPool[2])
                    .addClass(panelPool[2] + '-panel');
         
         $rightPanelContainer.data('oldschool', rightCur);
         $rightPanelContainer.data('school', panelPool[2]);
                             //.addClass(panelPool[2] + '-panel-container');
         
         // content update
         if(panelPool[2] === 'noschool')
             {
             noSchoolClone = noSchoolTemplate.cloneNode(true);
             $rightPanel.empty().append(noSchoolClone);
             }
         else if (panelPool[2])
             {
             schoolData = data/*.responseJSON*/[panelPool[2]];
             briefClone = briefTemplate.cloneNode(true);
              
             briefPanel = briefClone.childNodes[0];
             
                 
             briefHeader = [schoolData.abrev,
                            schoolData.full,
                            'Credits: ' + schoolData.minCredits];
                 
             if(panelPool[2] === 'WSU') { schoolData = data/*.responseJSON*/[panelPool[2]].campus.WSUP }
                 
             briefItems = briefPanel.children[3].children;
             briefItemsContent = [ [], [] ];
             
                 
             for(i = 0; i < 8; i++) { briefItemsContent[1].push(schoolData.reqs[classOrder[i]].credits);
                                      briefItemsContent[0].push(schoolData.reqs[classOrder[i]].full); }
                 
             for(i = 0; i < 3; i++) { briefPanel.children[i].innerHTML = briefHeader[i]; }

             for(i = 0; i < 4; i++) { briefItems[0].children[i].children[0].innerHTML = briefItemsContent[0][i];
                                      briefItems[0].children[i].children[1].innerHTML = briefItemsContent[1][i]; }
               
             for(i = 0; i < 3; i++) { briefItems[1].children[i].children[0].innerHTML = briefItemsContent[0][i+4];
                                      briefItems[1].children[i].children[1].innerHTML = briefItemsContent[1][i+4]; }
//              for(i = 0; i < 8; i++) { briefItems[i].children[0].innerHTML = briefItemsContent[0][i];
//                                       briefItems[i].children[1].innerHTML = briefItemsContent[1][i]; }
                 
             if(schoolData.reco !== "") { briefItems[1].children[3].innerHTML = 'Has university recommendations'; }
             else { briefItems[1].children[3].innerHTML = 'No recommendations'; }
                 
             briefItems[2].innerHTML = 'Click for more details!';
             $rightPanel.empty().append(briefClone);
             }
         }

  
//    if( $leftPanel.hasClass($leftPanel.data('oldschool') + '-panel') )
//          { $leftPanel.removeClass($leftPanel.data('oldschool') + '-panel'); }
            
//       if( $leftPanelContainer.hasClass($leftPanelContainer.data('oldschool') + '-panel-container') )
//             { $leftPanelContainer.removeClass($leftPanelContainer.data('oldschool') + '-panel-container'); }
         
//    if( $midPanel.hasClass($midPanel.data('oldschool') + '-panel') )
//          { $midPanel.removeClass($midPanel.data('oldschool') + '-panel'); }
         
//       if( $midPanelContainer.hasClass($midPanelContainer.data('oldschool') + '-panel-container') )
//             { $midPanelContainer.removeClass($midPanelContainer.data('oldschool') + '-panel-container'); }
         
//    if( $rightPanel.hasClass($rightPanel.data('oldschool') + '-panel') )
//          { $rightPanel.removeClass($rightPanel.data('oldschool') + '-panel'); }
         
//       if( $rightPanelContainer.hasClass($rightPanelContainer.data('oldschool') + '-panel-container') )
//             { $rightPanelContainer.removeClass($rightPanelContainer.data('oldschool') + '-panel-container'); }
 
   
}
    
function defineAnimations(relLeftPos, relMidPos, relRightPos)
{
    
animations =
    {
left :    {
          clicked :
                   {
                   begin  :
                            [
                                ['position', 'absolute'],
                                ['left', relLeftPos[0] + 'px'],
                                ['transition', 'transform 400ms ease 100ms'],
                                ['transform', 'translate(' +
                                    (relMidPos[0] - relLeftPos[0]) + 'px,' +
                                    (relMidPos[1] - relLeftPos[1]) + 'px)']
                            ],
                                
                 interim :
                            [
                                ['transition', 'transform 500ms'],
                                ['transform', 'scaleX(3) translateX(33.33333333%)']
                            ],
                    end :   [
                                ['position', 'relative'],
                                ['left', ''],
                                ['transition', ''],
                                ['transform', ''],
                                ['width', '100%']
                            ]
                   },

          notclicked :
                     {
                     begin  :
                               [
                                    ['position', 'absolute'],
                                    ['left', relLeftPos[0] + 'px'],
                                    ['transition', 'transform 800ms ease, opacity 1s ease'],
                                    ['transform', 'scale(0) translateX(1000%)'],
                                    ['opacity', '0']
                               ],
                     end :     [
                                    ['position', 'relative'],
                                    ['left', ''],
                                    ['transition', ''],
                                    ['transform', ''],
                                    ['width', '0'],
                               ]
                     },

          revert :
                   {
                   ifclicked : {    // CURRENT PANEL OPEN
                             begin  :
                                       [
                                            ['width', '33.33333333%'],
                                            ['transform', 'scaleX(3) translateX(33.33333333%)']
                                            

                                       ],
                             interim : [
                                           ['transition', 'transform 900ms ease 100ms'],
                                           ['transform', '']
                                 
                                       ],
                             end :     [
                                            ['transition', '']

                                       ]
                               },

                   ifnotclicked : {
                             begin  :
                                       [
                                            ['width', '33.33333333%'],
                                            ['transform', 'scale(0) translateX(1000%)'],
                                            ['opacity', '0']
                                            
                                       ],
                             interim : [
                                            ['transition', 'transform 800ms ease, opacity 800ms ease'],
                                            ['transform', ''],
                                            ['opacity', '']
                                 
                                       ],
                             end :     [
                                             ['transition', '']
                                       ]
                               }
                   }
          },

middle :  {
          clicked :
                   {
                   begin  :
                            [
                                ['position', 'absolute'],
                                ['left', relMidPos[0] + 'px'],
                                ['transition', 'transform 900ms ease 100ms'],
                                ['transform', 'scaleX(3)']
                            ],
                    end :   [
                                ['position', 'relative'],
                                ['left', ''],
                                ['transition', ''],
                                ['transform', ''],
                                ['width', '100%']
                            ]
                   },

          notclicked :
                    {

                     leftclicked : {
                                     begin  :
                                               [
                                                    ['transition', 'transform 800ms ease, opacity 800ms ease'],
                                                    ['transform', 'scale(0) translateX(-1250%)'],
                                                    ['opacity', '0']
                                               ],
                                     end :     [
                                                    ['transition', ''],
                                                    ['transform', ''],
                                                    ['width', '0']
                                               ]
                                     },
                   rightclicked : {
                                     begin  :
                                               [
                                                    ['transition', 'transform 800ms ease, opacity 800ms ease'],
                                                    ['transform', 'scale(0) translateX(1250%)'],
                                                    ['opacity', '0']
                                               ],
                                     end :     [
                                                    ['transition', ''],
                                                    ['transform', ''],
                                                    ['width', '0']
                                               ]
                                     }
                    },

          revert :
                   {
                   ifclicked : {    // CURRENT PANEL OPEN
                             begin  :
                                       [
                                            ['width', '33.33333333%'],
                                            ['transform', 'scaleX(3)']

                                       ],
                            interim :  [
                                            
                                            ['transition', 'transform 900ms ease 100ms'],
                                            ['transform', '']
                                       ],
                             end :     [
                                            
                                            ['transition', '']
                                       ]
                               },

                   ifnotclicked : {

                              rightclicked : {
                                             begin  :
                                                       [
                                                            ['width', '33.33333333%'],
                                                            ['transform', 'scale(0) translateX(1250%)'],
                                                            ['opacity', '0']
                                                            
                                                       ],
                                             interim : [
                                                            ['transition', 'transform 800ms ease, opacity 800ms ease'],
                                                            ['transform', ''],
                                                            ['opacity', '']
                                                       ],
                                             end :     [
                                                            ['transition', '']
                                                       ]
                                             },
                              leftclicked : {
                                             begin  :
                                                       [
                                                            ['width', '33.33333333%'],
                                                            ['transform', 'scale(0) translateX(-1250%)'],
                                                            ['opacity', '0']
                                                       ],
                                            interim : [
                                                            ['transition', 'transform 800ms ease, opacity 800ms ease'],
                                                            ['transform', ''],
                                                            ['opacity', '']
                                                       ],
                                             end :     [
                                                            ['transition', '']
                                                       ]
                                             }

                                  }
                   }
          },

right :   {
          clicked :
                   {
                   begin  :
                            [
                                ['position', 'absolute'],
                                ['left', relRightPos[0] + 'px'],
                                ['transition', 'transform 400ms ease 100ms'],
                                ['transform', 'translateX(' +
                                    (relMidPos[0]-relRightPos[0]) + 'px']
                            ],
                                
                 interim :
                            [
                                ['transition', 'transform 500ms'],
                                ['transform', 'scaleX(3) translateX(-33.33333333%)']
                            ],
                            
                    end :   [
                                ['position', 'relative'],
                                ['left', ''],
                                ['transition', ''],
                                ['transform', ''],
                                ['width', '100%']
                            ]
                   },

          notclicked :
                     {
                     begin  :
                               [
                                    ['position', 'absolute'],
                                    ['left', relRightPos[0] + 'px'],
                                    ['transition', 'transform 800ms ease, opacity 800ms ease'],
                                    ['transform', 'scale(0) translateX(-1000%)'],
                                    ['opacity', '0']
                               ],
                     end :     [
                                   
                                    ['transition', ''],
                                    ['transform', ''],
                                    ['width', '0']
                               ]
                     },

          revert :
                   {
                   ifclicked : {    // CURRENT PANEL OPEN
                             begin  :
                                       [
                                            ['position', 'absolute'],
                                            ['left', relRightPos[0] + 'px'],
                                            ['width', '33.33333333%'],
                                            ['transform', 'scaleX(3) translateX(-33.33333333%)']
                                            

                                       ],
                             interim : [
                                           ['transition', 'transform 900ms ease 100ms'],
                                           ['transform', 'scale(1) translate(0, 0)']
                                 
                                       ],
                             end :     [
                                            ['position', 'relative'],
                                            ['left', ''],
                                            ['transition', ''],
                                       ]
                               },

                   ifnotclicked : {
                             begin  :
                                       [
                                            ['position', 'absolute'],
                                            ['left', '66.66666666%'],
                                            ['width', '33.33333333%'],
                                            ['transform', 'scale(0) translateX(-1000%)'],
                                            ['opacity', '0']
                                            
                                       ],
                             interim : [
                                            ['transition', 'transform 800ms ease, opacity 800ms ease'],
                                            ['transform', ''],
                                            ['opacity', '']
                                 
                                       ],
                             end :     [
                                             ['position', 'relative'],
                                             ['left', ''],
                                             ['transition', '']
                                       ]
                               }
                   }
          }
    }

}

var $background = $('#background');
var $photoCredit = $('#photo-credit').children('a');
var photoLinks = {
                    CWU : ['https://www.flickr.com/photos/pictoscribe/400466415/in/' +
                            'photolist-BouHn-f7MfVL-4FV2B9-qq2a2u-dAP2Qf-9LPBnH-8Acc7V-' +
                            'jNURex-dtw3FT-jrK4LJ-ejw8FJ-8APygD-4yURaW-nPZ3BR-qPaQa1-9M2DUT-' +
                            'boBrcG-3Grpof-4xjPTj-abftTW-9NEtYQ-qRok5W-iUHESK-8AccNX-9NJybd-' +
                            '6aSVqu-8AfhiJ-9NAsCc-8Ac4nF-g18McA-4yQBqZ-nSRAPy-n1TaXZ-9NxpGY-' +
                            'onLhdx-9Nz3As-fJ9Tff-bR4uNv-8qQG5K-dFLBzi-BogHo-4xjQd3-rkiuyy-borLsB-' +
                            'bJmg8P-9NBTQp-5G1AyQ-bgZ192-bnKayP-6b6ku9', 'Pictoscribe'],
    
                    EWU : ['https://www.flickr.com/photos/ewuphoto/3442400154/in/' +
                            'photolist-6fccCN-5JMUmY-9NxpGY-9Nz3As-fJ9Tff-9NwF7E-8NeFVR-' +
                            'mhH6xF-bMTukp-9NBTQp-6b6ku9-mL1xaX-bNt3VV-9NAqQe-74eSzs-gb7X1n-' +
                            'cLPk5j-9LBtV2-7Tx3yN-nCyZao-9NDUEY-kVUSH-cLPjX1-9U63p6-8v2ikX-oUghni-' +
                            'gb7qGj-74aRG2-9NC9uz-bzWpg3-8R1jkK-gvGmds-gqRrPs-k7m8Ue-9NED8w-99q2QZ-' +
                            '9moxrU-pripqq-p2zqLr-74eemN-9NvF6h-sGwSH7-9NsCbe-mL1AYP-sGwQW1-9xKFSJ-' +
                            'oUf8yk-9h1d7f-4vMh8G-pbKyGt/', 'Eastern Washington University'],
    
                    UWS : ['https://www.flickr.com/photos/cronncc/7134527305/in/photolist-bSsjpt-' +
                            '9VJaLE-peJKgK-e4PBQr-7DjPBn-8Vdi9w-e4PBCF-qARqog-oXvpx6-dv3fU7-fthjJp-' +
                            'dwwk9c-bPmjN2-9xS7oT-mktEXp-3p3jUt-9eYzPz-7SrTd3-8twHkg-dpNseh-3mdHX-bsLr9C' +
                            '-efGGV8-mkycLm-8JC9GT-mktQSV-2XVHR8-mkxp3w-c7hjCs-3JR1HN-8VdjtQ-aEdrH-a9ej8K' +
                            '-9WQSmF-gsTpsu-m6TyUu-pney3d-eEDt9S-5tSCZf-EGj6GS-6xBpex-6fkT9N-gzsbDj-4QRTV1' +
                            '-4FKQ2e-ftwEyS-3opqX-mkw1cJ-632RMf-2Y17xs', 'Curtis Cronn'],
    
                    UWB : ['https://www.flickr.com/photos/cronncc/4589500963/in/photolist-7ZyoJX-7ZysdM-' +
                           '2XVHR8-2Y17xs-2XVFmx-2Y16TC-2Y17Eh-2Y15c3-2XVFwR-2XVGBg-2XVGgF-2XVH4B-2XVFQP-' +
                            '2XVG1V-2Y16oW-2Y15Fh-7Zyxfp-7ZyqwX-7ZBErS-7ZysKZ-dGuBhf-dGuz9Y-dGuDky-dGuN1L-' +
                            'dGuFXf-dGo6Sp-dGmSp2-dGokZM-houuFh-hougtA-dGvuyd-pHv9oV-dGo4ev-dGsN8h-dGsKkG-' +
                            'hou5dY-rqqLxS-dGv4oA-dGuakq-dGrUwE-houeiv-pHv8JP-dGnesc-dGpTh8-dGuJFU-dGnCkx-' +
                            'dGmMTc-houb4C-dGpwnH-dGrHtq', 'Curtis Cronn'],
    
                    UWT : ['https://www.flickr.com/photos/joebehr/6866954108/in/photolist-bsNWdu-bsNWhU-' +
                            'bFHNni-bFHNfH-bsNWfj-hzmTGN-hBaa6o-bsNWgd-dCiZBy-2XVHR8-dsC5Xh-bFHNvx-2Y17xs-' +
                            '2XVFmx-bFHNwF-bFHNjD-bsNWmd-bFHNgP-2Y16TC-2Y17Eh-dsBXsu-2XVFwR-b59NSz-2Y15c3-' +
                            'bvMuW5-hzmWCY-B3Rhos-bvMvbS-bFHNhR-2XVGBg-bvMv7d-bJGhi8-2XVGgF-2XVH4B-iNUHj-hzmXUp' +
                            '-2XVFQP-dCdP7p-2XVG1V-B78DtD-2Y16oW-A9f7dX-dsBQ4r-A9fVB4-B3RrY9-iNUN7-3hBca6-3hBcgp-' +
                            '8Fg29Z-nMBf6A/', 'Joe Wolf'],
    
                    WSU : ['https://www.flickr.com/photos/thunderchild5/510965913/in/photolist-M9Qn8-aou6d6-' +
                            '6grWDC-aouaMT-aowT2S-5TfY17-aou9uH-aowUvG-aoucFV-aowSvy-6grWGq-6AVAC8-aou9ia-' +
                            'aoucyx-M68PS-6ANprb-aowUYm-aoubYg-8bx2Nm-f1yhaD-aowPNN-oG2kce-bYBo3A-aou63P-aou5CT' +
                            '-aowSg5-eU8F2Y-5w2tmx-aoubnv-aou7Gc-5U2XuX-aowQoo-aowVaf-5U2XPc-5w6P63-aou6W2-5U2XSM' +
                            '-aowWk3-aowU2d-aou6FF-aowRN7-aou8Un-aowP7S-5U7jnb-aowVHf-aowQHG-5U2Ycn-aou7gx-7a61qK-5NMjmz', 'Thunderchild7'],
    
                    WWU : ['https://www.flickr.com/photos/danube/106835078/in/photolist-arym7-ipwJp8-pzFxL7-figahB-' +
                            'eQNU4i-5cc3xP-fT4ovT-7gG7rp-b6Kzkt-nxeDi5-483jHe-72G8Ts-8EncVJ-7Pn3b7-jdsADA-pyxfKm-rY1qap' +
                            '-6Pd2GR-pa3Hjc-i8yLvh-oBoqj5-2cWNX-rhgTk1-ips2R2-i8yBqb-aSZXiz-r7FnTM-qUAFTF-i8ywkb-ipvsfj-' +
                            'fKwTBa-nfyFUv-itv23E-qmPeb8-pa3MsH-pKDJq2-fz5ksd-9M2DUT-6XAHpk-72Ca8i-6XArt8-hXHHUY-cNPUNo-' +
                            'fig8JZ-hXHAK7-5AUXL-5mUx2C-fig9M6-edw45y-eQNUia', 'ChadBriggs'],
    
                    GU : ['https://www.flickr.com/photos/han_shot_first/5569017011/in/photolist-9u7EJF-6mLG6w-6mLG6L-8nkJ4v-' +
                          '9uhaBW-34wmW-34wmX-7ayAep-9u7AMr-qSqhYn-9uh7TQ-rP8ixR-rPdg9M-qSdixJ-2W5MBm-6mLG61-9ue5SR-9vCszp-gu7dZG-' +
                          '9ue7Rr-9vCyCZ-aznn9N-9ue8Sx-3jVsG8-9vCwzx-3jVsNT-9vFwX9-bbaMVR-m8bJG6-m8cpxa-9vBxEa-8SUZxj-baPQAz-baPQWz-' +
                          'cvYTQQ-b1sbN6-9vDKcp-m8cq2B-m8dqYA-9vCG5i-9vGQ17-9vFLQL-9VYTeS-9VYTgq-9vEeJS-9VYTjL-9XLG7z-8SRVdT-m8drPU-' +
                          '8mEJYx', 'Michael Li'],
    
                    HU : ['https://www.flickr.com/photos/mytravelphotos/2863763957/in/photolist-5n4xfD-5n8Pms-5n4xSB-5n8MZ5' +
                           '-5n8NvJ-5n8NXw-5n8N1w-5n4wdn-5n4xrX-5n4x48-5n4wsv-5n8MMG-5n8NW9-5n8MHC-5n4wU4-5n4wHv-acGPu5-uU9G88' +
                           '-uRQcsw-uBGnxV-uByGMd-uBySjC-uByRqJ-tX8UbC-tXiKyM-uU9GwK-uRQaBN-acE1eX-acGPwU-eL9CAo-eL9FqJ-eKXCW2-' +
                           'eKY27p-eKXz3K-eL9Fys-eKXZxg-eKXBUZ-eL9ZXU-eKXtUT-eKXyGF-eKXiPz-eL9JjA-eKXWnB-eKXt3x-eLaruC-eLakVA-' +
                           '6ZStKJ-eKXseK-eKXu86-eKXxUc', 'Jasperdo'],
    
                    PLU : ['https://www.flickr.com/photos/kdeming/2460043820/in/photolist-4KonjC-qQERC3-qyjD8e-8A138y-47YPfu-' +
                            'qNshRS-qyc7Uq-qyjT5n-5wUxAn-qQAe9P-dmphfG-s6ouq4-CHm8Z-47UP7i-8d1hW2-47UKGx-qyinQp-dff5cw-4L7fCT-' +
                            'qyb6Fy-dff4ev-8d1imp-qQKqjk-dffxNX-dffxDD-qQAcDp-dffa6a-8d1iAT-4Konph-dffxXF-4LddVb-qybaq7-qyc5vY-' +
                            'dffaRh-dffbiq-dffxtk-cZnFaU-amewzA-qybVVG-dffdqn-dff2RR-dff4eJ-dff4ND-7FQ1qt-47UMJz-dxZ5KG-8d1hta-' +
                            'd3WCfm-qQA3vz-d3WjvL', 'Kit Deming'],
    
                    SPU : ['https://www.flickr.com/photos/rutlo/3043628894/in/photolist-5CT6Ve-5CXoQf-5CT6KX-aUakxD-aUaiwt-' +
                            'gRByJE-aUanoD-6R31FR-6JwaSr-pkdecq-pw6AFa-r4x2qh-9NC9uz-2Xj3bZ-vdG9k-pripqq-peRKfK-9NsCbe-puiDos-' +
                            'e17nBN-9NGokq-aTB1Up-9E6KXX-p5CyNW-7mHKLW-4yhqAm-sRZzmY-gRBah9-gRBXVP-gRC19K-gRAAaM-r8khZD-hxBLPF-' +
                            'gRAZ8a-gRC4sP-q7KJ5v-9QePrp-peTBEw-pukJ1Q-pukEML-dVu1hb-2Y16TC-2XVFwR-2XVHR8-aBsBk5-2XVGBg-8xUTen-' +
                            'pwmk3Y-fSmHmb-2XVGgF/', 'Matthew Rutledge'],
    
                    SU : ['https://www.flickr.com/photos/sueanddanny/242203506/in/photolist-npmEw-aeA5Ga-neKhZ8-c7f1NY-4j3Bjo-' +
                           'aD7Nbw-aD7NPE-4FQ2us-aD3VeB-aD3W94-aD3UJZ-aD7M9C-c7f3N1-5avBwj-c7f6wq-6pu7Yw-aD7M5S-bSsjpt-npk35' +
                           '-npkUm-npm1m-aB5T3b-5Kex8q-4tH6Rk-5BC2in-oeQKU1-fuzjSD-eoQcP-c7f5oY-dDeNJv-aB3akZ-34eHRH-4WpZhQ-9V8hMk' +
                           '-6pu7rE-woWwDs-c7f1am-e3uYcj-8XTQVf-npmfM-aD3Wpi-aDUBiC-4WkRKx-aB3e2R-aB5XqA-c7f2Ko-4WpYqu-4WkJfF-aD3X4a' +
                          '-phY2tq', 'Sue & Danny Yee'],
    
                    WU : ['https://www.flickr.com/photos/32682702@N06/15122942935/in/photostream/', 'Scott Ellison']
    
                 };
    
var $startPage = $('#start-page');
var $startHeader = $('#get-started-header > *');
var $startBtnContainer = $('#get-started-btn-container');
var $startBtn = $('#get-started-btn');
var $startTileContainer = $('#start-page-tile-container');
var $startTiles = $startTileContainer.find('.start-tile');

var $mainPage = $('#flex-hold');
var $bottomRowSection = $('#bottom-row-section1');
var $buttonPanel = $('#button-panel');
var $mainButtons = $('.class-btn');
var $leftPanelContainer = $('#left');
var $midPanelContainer = $('#middle');
var $rightPanelContainer = $('#right');
var $Panels = $leftPanelContainer
              .add($midPanelContainer)
              .add($rightPanelContainer);
    
var relLeftPos, relMidPos, relRightPos, animations, buttonOff;
var panelsActivated = false;
        

var $leftPanel = $('#left-content');
var $midPanel = $('#middle-content');
var $rightPanel = $('#right-content');
var panelPool = [];

var data;
/*loadSchoolJSON();
    
function loadSchoolJSON()
{

    try
    {
        
                data = $.getJSON('school_data.json')
                .done(function(){console.log('success');
                                $startBtn.html('GET STARTED');})
                .fail(function(){
                    alert('Problem occured loading school info will retry soon.');
                    setTimeout(loadSchoolJSON, 5000);
                                
              
                                });
            
    }
    catch(e)
    {
        $startBtn.html('Problem occured loading school info will retry soon.');
        setTimeout(loadSchoolJSON, 5000);
    }
  
}*/
  
var briefTemplate = document.createDocumentFragment();
var infoTemplate = document.createDocumentFragment();
var noSchoolTemplate = document.createDocumentFragment();
var labelTemplate1 = document.createDocumentFragment();
var labelTemplate2 = document.createDocumentFragment();
    
var panelBriefElement = document.createElement('div');
panelBriefElement.classList.add('col-xs-11', 'panel-brief');
panelBriefElement.classList.add('col-md-10', 'panel-brief');
panelBriefElement.innerHTML =   '<div class="col-xs-12 panel-school-abrev"></div>' +
                                '<div class="col-xs-12 panel-school-full"></div>' +
                                '<div class="col-xs-12 panel-credit-req"></div>' +
                                '<div class="col-xs-12 panel-credit-items">' +
                                    '<div class="col-xs-12"><div class="col-xs-3 col-md-12 MAJ"><div class="MAJ-text"></div><div class="MAJ-num"></div></div>' +
                                    '<div class="col-xs-3 col-md-12 QUA"><div class="QUA-text"></div><div class="QUA-num"></div></div>' +
                                    '<div class="col-xs-3 col-md-12 SOC"><div class="SOC-text"></div><div class="SOC-num"></div></div>' +
                                    '<div class="col-xs-3 col-md-12 NAT"><div class="NAT-text"></div><div class="NAT-num"></div></div></div>' +
                                    '<div class="col-xs-12"><div class="col-xs-3 col-md-12 HUM"><div class="HUM-text"></div><div class="HUM-num"></div></div>' +
                                    '<div class="col-xs-3 col-md-12 COM"><div class="COM-text"></div><div class="COM-num"></div></div>' +
                                    '<div class="col-xs-3 col-md-12 UNI"><div class="UNI-text"></div><div class="UNI-num"></div></div>' +
                                    '<div class="col-xs-3 col-md-12 reco"></div></div>' +
                                    '<div class="col-xs-12 col-md-12 expand-note"></div>' +
                                '</div>';
briefTemplate.appendChild(panelBriefElement);
                        

var noSchoolElement = document.createElement('div');
//noSchoolElement.classList.add('');
noSchoolElement.innerHTML = 'Select A University Below';
noSchoolTemplate.appendChild(noSchoolElement);
    
    
var labelElement1 = document.createElement('label');
labelElement1.classList.add('col-xs-12');
labelElement1.innerHTML =   '<input />' +
    
                            '<div class="col-xs-2 checkbox-holder">' +
                                '<div class="checkbox-spacer">' +
                                    '<div class="check-box"></div>' +
                                '</div>' +
                            '</div>' +
    
                            '<div class="col-xs-10 info-data">' +
    
                                '<div class="col-xs-3 info-num-container">' +
                                    '<div class="info-num-spacer">' +
                                        '<div class="col-xs-12 info-num"></div>' +
                                    '</div>' +
                                '</div>' +
    
                                '<div class="col-xs-9 info-text">' +
                                    '<div class="col-xs-12 abrev"></div><div class="col-xs-12 full"></div>' +
                                '</div>' +
    
                            '</div>';
labelTemplate1.appendChild(labelElement1);


    
    
var labelElement2 = document.createElement('label');
labelElement2.classList.add('col-xs-12');
labelElement2.innerHTML = '<input type="radio" id="MAJ-2" name="MAJ" />' +

                                '<div class="col-xs-2 checkbox-holder">' +
                                    '<div class="checkbox-spacer">' +
                                        '<div class="check-box"></div>' +
                                    '</div>' +
                                '</div>' +
    
                                '<div class="col-xs-10 info-data-mult">' +
    
                                            '<div class="col-xs-12 info-data-part-1">' +
                                                '<div class="col-xs-3 info-num-container">' +
                                                    '<div class="info-num-spacer"><div class="col-xs-12 info-num"></div></div>' +
                                                '</div>' +

                                                '<div class="col-xs-9 info-text">' +
                                                    '<div class="col-xs-12 abrev"></div><div class="col-xs-12 full"></div>' +
                                                '</div>' +

                                            '</div>' +
    
                                            '<div class="col-xs-12 info-data-part-2">' +

                                                '<div class="col-xs-3 info-num-container">' +
                                                    '<div class="info-num-spacer">' +
                                                        '<div class="info-num">' +
                                                            '<div class="info-link-arrow"></div>' +
                                                        '</div>' +
                                                    '</div>' +
                                                '</div>' +
    
                                                '<div class="col-xs-9 info-text">' +
                                                        '<div class="col-xs-12 abrev"></div><div class="col-xs-12 full"></div>' +
                                                '</div>' +

                                             '</div>' +
    
                                                

                                    '</div>';
    
labelTemplate2.appendChild(labelElement2);
              
    
var infoElement = document.createElement('div');
infoElement.classList.add('col-xs-12');
infoElement.id = "info-container";
infoElement.innerHTML = '<div id="info-left-col" class="col-md-3 col-xs-12">' +
                                        '<div id="info-school-container" class="col-md-12 col-xs-12">' +
                                            '<div class="col-xs-12 info-school">' +
                                                '<div class="col-xs-12 info-school-abrev"></div>' +
                                                '<div class="col-xs-12 info-school-full"></div>' +
                                                '<div class="col-xs-12 info-credit-req"></div>' +
                                            '</div>' +
                                        '</div>' +
                                                '<div id="info-reco-container" class="col-md-12 col-xs-12">' +
                                                    '<div class="col-xs-12 info-reco">' +
                                                        '<div class="col-xs-12 recomendations"></div>' +
                                                        '<div class="col-xs-12 print-button"></div>' +
                                                    '</div>' +
                                                '</div>' +
                        '</div>' +
    
    
                        '<div id="info-rows" class="col-md-9 col-xs-12">' +
    
                                    '<div id="info-column-1" class="col-md-3 col-xs-12">' +

                                        '<div class="col-xs-12 info-tile MAJ">' +
                                                    '<div class="col-xs-12 info-head">' +
                                                                    '<div class="col-xs-3 info-num-container">' +
                                                                        '<div class="info-num-spacer"><div class="col-xs-12 info-num"></div></div>' +
                                                                    '</div>' +
                                                        '<div class="col-xs-9 info-text"></div>' +
                                                    '</div>' +
                                            '<div class="col-xs-12 info-body">' +
                                            '</div>' +
                                        '</div>' +

                                        '<div class="col-xs-12 info-tile QUA">' +
    
                                            '<div class="col-xs-12 info-head">' +
                                                '<div class="col-xs-3 info-num-container">' +
                                                    '<div class="info-num-spacer"><div class="col-xs-12 info-num"></div></div>' +
                                                '</div>' +
                                                '<div class="col-xs-9 info-text"></div>' +
                                            '</div>' +

                                            '<div class="col-xs-12 info-body">' +
                                            '</div>' +

                                        '</div>' +

                             '</div>' +
    
                            '<div id="info-column-2" class="col-md-3 col-xs-12">' +

                                    '<div class="col-xs-12 info-tile SOC">' +
    
                                        '<div class="col-xs-12 info-head">' +
                                            '<div class="col-xs-3 info-num-container">' +
                                                '<div class="info-num-spacer"><div class="col-xs-12 info-num"></div></div>' +
                                            '</div>' +
                                            '<div class="col-xs-9 info-text"></div>' +
                                        '</div>' +
    
                                        '<div class="col-xs-12 info-body">' +
                                            '</div>' +
    
                                    '</div>' +
    
                                    '<div class="col-xs-12 info-tile NAT">' +
    
                                        '<div class="col-xs-12 info-head">' +
                                            '<div class="col-xs-3 info-num-container">' +
                                                '<div class="info-num-spacer"><div class="col-xs-12 info-num"></div></div>' +
                                            '</div>' +
                                            '<div class="col-xs-9 info-text"></div>' +
                                        '</div>' +
                                        '<div class="col-xs-12 info-body">' +
                                         '</div>' +
    
                                    '</div>' +
    
                            '</div>' +
    
                            '<div id="info-column-3" class="col-md-3 col-xs-12">' +
    
                                        '<div class="col-xs-12 info-tile HUM">' +
    
                                            '<div class="col-xs-12 info-head">' +
                                                '<div class="col-xs-3 info-num-container">' +
                                                    '<div class="info-num-spacer"><div class="col-xs-12 info-num"></div></div>' +
                                                '</div>' +
                                                '<div class="col-xs-9 info-text"></div>' +
                                            '</div>' +
                                            '<div class="col-xs-12 info-body">' +
                                            '</div>' +
    
                                        '</div>' +
    
                                        '<div class="col-xs-12 info-tile COM">' +
    
                                            '<div class="col-xs-12 info-head">' +
                                                '<div class="col-xs-3 info-num-container">' +
                                                    '<div class="info-num-spacer"><div class="col-xs-12 info-num"></div></div>' +
                                                '</div>' +
                                                '<div class="col-xs-9 info-text"></div>' +
                                            '</div>' +
                                            '<div class="col-xs-12 info-body">' +
                                             '</div>' +
    
                                        '</div>' +
    
                            '</div>' +

                                        '<div id="info-column-4" class="col-md-3 col-xs-12">' +

                                            '<div class="col-xs-12 info-tile UNI">' +
    
                                                '<div class="col-xs-12 info-head">' +
                                                    '<div class="col-xs-3 info-num-container">' +
                                                        '<div class="info-num-spacer"><div class="col-xs-12 info-num"></div></div>' +
                                                    '</div>' +
                                                    '<div class="col-xs-9 info-text"></div>' +
                                                '</div>' +
                                                '<div class="col-xs-12 info-body">' +
                                                '</div>' +
    
                                            '</div>' +

                                            '<div class="col-xs-12 info-tile ELE">' +
    
                                                '<div class="col-xs-12 info-head">' +
                                                    '<div class="col-xs-3 info-num-container">' +
                                                        '<div class="info-num-spacer"><div class="col-xs-12 info-num"></div></div>' +
                                                    '</div>' +
                                                    '<div class="col-xs-9 info-text"></div>' +
                                                '</div>' +
                                                '<div class="col-xs-12 info-body">' +
                                                '</div>' +
    
                                            '</div>' +

                                        '</div>' +
    
                        '</div>';
infoTemplate.appendChild(infoElement);
    


    
init();

data = {
"CWU" : {
        "abrev" : "CWU",
        "full" : "Central Washington University",
        "minCredits" : "90",
        "reco" : "",
        "reqs" :
                {
                  "COM" :
                        {
                          "full" : "Communication Skills",
                          "credits" : "10",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ENGL& 101",
                                          "full" : "English Composition",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ENGL& 235",
                                          "full" : "Technical Writing",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "QUA" :
                        {
                          "full" : "Quantitative / Symbolic Reasoning",
                          "credits" : "5",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "MATH& 151",
                                          "full" : "Calculus 1",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "HUM" :
                        {
                          "full" : "Humanities",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "SOC" :
                        {
                          "full" : "Social Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "NAT" :
                        {
                          "full" : "Natural Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS& 221",
                                          "full" : "Engineering Physics 1 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "PHYS& 222",
                                          "full" : "Engineering Physics 2 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "MATH& 152",
                                          "full" : "Calculus 2",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "MAJ" :
                        {
                          "full" : "Major Requirements",
                          "credits" : "15-20",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY JAVA",
                                          "full" : "Computer Programming 1",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY JAVA",
                                          "full" : "Computer Programming 2",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev1" : "MATH& 153",
                                          "abrev2" : "MATH& 254",
                                          "full" : "Calculus 3",
                                          "credits" : "10",
                                          "or" : "true"
                                        },
                                        {
                                          "abrev" : "MATH& 163",
                                          "full" : "Calculus 3",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "UNI" :
                        {
                          "full" : "University Specific Requirements",
                          "credits" : "0",
                          "classes" :
                                    [
                                    ]
                        },
                    "ELE" :
                        {
                          "full" : "Electives",
                          "credits" : "10-15",
                          "classes" :
                                    [
                                    ]
                        }


                }
     },
    
"EWU" : {
        "abrev" : "EWU",
        "full" : "Eastern Washington University",
        "minCredits" : "90",
        "reco" : "",
        "reqs" :
                {
                  "COM" :
                        {
                          "full" : "Communication Skills",
                          "credits" : "10",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ENGL& 101",
                                          "full" : "English Composition",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ENGL& 102",
                                          "full" : "English Composition 2",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "QUA" :
                        {
                          "full" : "Quantitative / Symbolic Reasoning",
                          "credits" : "5",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "MATH& 151",
                                          "full" : "Calculus 1",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "HUM" :
                        {
                          "full" : "Humanities",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHIL 212",
                                          "full" : "Introductory Ethics",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "SOC" :
                        {
                          "full" : "Social Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "NAT" :
                        {
                          "full" : "Natural Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS& 221",
                                          "full" : "Engineering Physics 1 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "PHYS& 222",
                                          "full" : "Engineering Physics 2 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "MATH& 152",
                                          "full" : "Calculus 2",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "MAJ" :
                        {
                          "full" : "Major Requirements",
                          "credits" : "15-20",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY C++, JAVA",
                                          "full" : "Computer Programming 1",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY C++, JAVA",
                                          "full" : "Computer Programming 2",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev1" : "MATH& 153",
                                          "abrev2" : "MATH& 254",
                                          "full" : "Calculus 3",
                                          "credits" : "10",
                                          "or" : "true"
                                        },
                                        {
                                          "abrev" : "MATH& 163",
                                          "full" : "Calculus 3",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "UNI" :
                        {
                          "full" : "University Specific Requirements",
                          "credits" : "0",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "MATH 231",
                                          "full" : "Linear Algebra",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "EENG 160",
                                          "full" : "Digital Circuits",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "ELE" :
                        {
                          "full" : "Electives",
                          "credits" : "0-5",
                          "classes" :
                                    [
                                    ]
                        }


                }
     },
    
    
"UWS" : {
        "abrev" : "UWS",
        "full" : "University of Washington Seattle",
        "minCredits" : "90",
        "reco" : "",
        "reqs" :
                {
                  "COM" :
                        {
                          "full" : "Communication Skills",
                          "credits" : "10",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ENGL& 101",
                                          "full" : "English Composition",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ENGL& 235",
                                          "full" : "Technical Writing",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "QUA" :
                        {
                          "full" : "Quantitative / Symbolic Reasoning",
                          "credits" : "5",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "MATH& 151",
                                          "full" : "Calculus 1",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "HUM" :
                        {
                          "full" : "Humanities",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "SOC" :
                        {
                          "full" : "Social Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "NAT" :
                        {
                          "full" : "Natural Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS& 221",
                                          "full" : "Engineering Physics 1 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "PHYS& 222",
                                          "full" : "Engineering Physics 2 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "MATH& 152",
                                          "full" : "Calculus 2",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "MAJ" :
                        {
                          "full" : "Major Requirements",
                          "credits" : "15-20",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY JAVA",
                                          "full" : "Computer Programming 1",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY JAVA",
                                          "full" : "Computer Programming 2",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev1" : "MATH& 153",
                                          "abrev2" : "MATH& 254",
                                          "full" : "Calculus 3",
                                          "credits" : "10",
                                          "or" : "true"
                                        },
                                        {
                                          "abrev" : "MATH& 163",
                                          "full" : "Calculus 3",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "UNI" :
                        {
                          "full" : "University Specific Requirements",
                          "credits" : "0",
                          "classes" :
                                    [
                                    ]
                        },
                    "ELE" :
                        {
                          "full" : "Electives",
                          "credits" : "10-15",
                          "classes" :
                                    [
                                    ]
                        }


                }
     },
    
    
"UWB" : {
        "abrev" : "UWB",
        "full" : "University of Washington Bothell",
        "minCredits" : "90",
        "reco" : "",
        "reqs" :
                {
                  "COM" :
                        {
                          "full" : "Communication Skills",
                          "credits" : "10",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ENGL& 101",
                                          "full" : "English Composition",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ENGL& 235",
                                          "full" : "Technical Writing",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "QUA" :
                        {
                          "full" : "Quantitative / Symbolic Reasoning",
                          "credits" : "5",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "MATH& 151",
                                          "full" : "Calculus 1",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "HUM" :
                        {
                          "full" : "Humanities",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "SOC" :
                        {
                          "full" : "Social Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "NAT" :
                        {
                          "full" : "Natural Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS& 221",
                                          "full" : "Engineering Physics 1 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "PHYS& 222",
                                          "full" : "Engineering Physics 2 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "MATH& 152",
                                          "full" : "Calculus 2",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "MAJ" :
                        {
                          "full" : "Major Requirements",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "C#, C++, JAVA",
                                          "full" : "Only one language",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "C#, C++, JAVA",
                                          "full" : "Only one language",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "STATS",
                                          "full" : "Statistics",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "UNI" :
                        {
                          "full" : "University Specific Requirements",
                          "credits" : "0",
                          "classes" :
                                    [
                                    ]
                        },
                    "ELE" :
                        {
                          "full" : "Electives",
                          "credits" : "15",
                          "classes" :
                                    [
                                    ]
                        }


                }
     },
    
    
"UWT" : {
        "abrev" : "UWT",
        "full" : "University of Washington Tacoma",
        "minCredits" : "90",
        "reco" : "",
        "reqs" :
                {
                  "COM" :
                        {
                          "full" : "Communication Skills",
                          "credits" : "10",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ENGL& 101",
                                          "full" : "English Composition",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ENGL& 235",
                                          "full" : "Technical Writing",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "QUA" :
                        {
                          "full" : "Quantitative / Symbolic Reasoning",
                          "credits" : "5",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "MATH& 151",
                                          "full" : "Calculus 1",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "HUM" :
                        {
                          "full" : "Humanities",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "SOC" :
                        {
                          "full" : "Social Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "NAT" :
                        {
                          "full" : "Natural Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS& 221",
                                          "full" : "Engineering Physics 1 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "lab based science",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "STATS",
                                          "full" : "Statistics",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "MAJ" :
                        {
                          "full" : "Major Requirements",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "JAVA",
                                          "full" : "Intro Programming",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "JAVA",
                                          "full" : "Object Oriented Programming",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "STATS",
                                          "full" : "Statistics",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "UNI" :
                        {
                          "full" : "University Specific Requirements",
                          "credits" : "0",
                          "classes" :
                                    [
                                    ]
                        },
                    "ELE" :
                        {
                          "full" : "Electives",
                          "credits" : "15",
                          "classes" :
                                    [
                                    ]
                        }


                }
     },

"WSU" : {
    
            "abrev" : "WSU",
            "full" : "Washington State University",
            "minCredits" : "90",
            "campus" :
                    {
                        
            "WSUP" : {
                    "abrev" : "WSUP",
                    "full" : "Washington State University Pullman",
                    "minCredits" : "90",
                    "reco" : "Recommends Discrete Structures. Discrete Structures is a certification course for computer science and as such is required for admittance to the computer science program. Recommends Macro or Micro economics to meet five credits of the social science requirement.",
                    "reqs" :
                            {
                              "COM" :
                                    {
                                      "full" : "Communication Skills",
                                      "credits" : "10",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "ENGL& 101",
                                                      "full" : "English Composition",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ENGL& 235",
                                                      "full" : "Technical Writing",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "QUA" :
                                    {
                                      "full" : "Quantitative / Symbolic Reasoning",
                                      "credits" : "5",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "MATH& 151",
                                                      "full" : "Calculus 1",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "HUM" :
                                    {
                                      "full" : "Humanities",
                                      "credits" : "15",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "ANY",
                                                      "full" : "",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ANY",
                                                      "full" : "",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ANY",
                                                      "full" : "",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "SOC" :
                                    {
                                      "full" : "Social Sciences",
                                      "credits" : "15",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "ANY",
                                                      "full" : "",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ANY",
                                                      "full" : "",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ANY",
                                                      "full" : "See recommendations",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "NAT" :
                                    {
                                      "full" : "Natural Sciences",
                                      "credits" : "15",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "PHYS& 221",
                                                      "full" : "Engineering Physics 1 with lab",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "PHYS& 222",
                                                      "full" : "Engineering Physics 2 with lab",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "MATH& 152",
                                                      "full" : "Calculus 2",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "MAJ" :
                                    {
                                      "full" : "Major Requirements",
                                      "credits" : "20",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "ANY C++, JAVA",
                                                      "full" : "Computer Programming 1",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ANY C++, JAVA",
                                                      "full" : "Computer Programming 2",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "MATH& 153",
                                                      "full" : "Calculus 3",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "MATH& 254",
                                                      "full" : "Calculus 3",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "UNI" :
                                    {
                                      "full" : "University Specific Requirements",
                                      "credits" : "10",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "PHYS, BIO, EARTH",
                                                      "full" : "Science with lab",
                                                      "credits" : "5"
                                                    },

                                                    {
                                                      "abrev" : "PHYS& 223",
                                                      "full" : "Engineering Physics 3 with lab",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "ELE" :
                                    {
                                      "full" : "Electives",
                                      "credits" : "5",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "PHIL& 120",
                                                      "full" : "Symbolic Logic",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    }


                            }
                 },
                        
                        

            "WSUV" : {
                    "abrev" : "WSUV",
                    "full" : "Washington State University Vancouver",
                    "minCredits" : "90",
                    "reco" : "Recommends Discrete Structures. Discrete Structures is a certification course for computer science and as such is required for admittance to the computer science program",
                    "reqs" :
                            {
                              "COM" :
                                    {
                                      "full" : "Communication Skills",
                                      "credits" : "10",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "ENGL& 101",
                                                      "full" : "English Composition",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ENGL& 235",
                                                      "full" : "Technical Writing",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "QUA" :
                                    {
                                      "full" : "Quantitative / Symbolic Reasoning",
                                      "credits" : "5",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "MATH& 151",
                                                      "full" : "Calculus 1",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "HUM" :
                                    {
                                      "full" : "Humanities",
                                      "credits" : "15",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "ANY",
                                                      "full" : "",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ANY",
                                                      "full" : "",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ANY",
                                                      "full" : "",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "SOC" :
                                    {
                                      "full" : "Social Sciences",
                                      "credits" : "15",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "ANY",
                                                      "full" : "",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ANY",
                                                      "full" : "",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ECON& 201",
                                                      "full" : "Macro Economics",
                                                      "credits" : "5",
                                                        "or" : "true"
                                                    },
                                                    {
                                                      "abrev" : "ECON& 202",
                                                      "full" : "Micro Economics",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "NAT" :
                                    {
                                      "full" : "Natural Sciences",
                                      "credits" : "15",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "PHYS& 221",
                                                      "full" : "Engineering Physics 1 with lab",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "PHYS& 222",
                                                      "full" : "Engineering Physics 2 with lab",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "MATH& 152",
                                                      "full" : "Calculus 2",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "MAJ" :
                                    {
                                      "full" : "Major Requirements",
                                      "credits" : "20",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "ANY C++, JAVA",
                                                      "full" : "Computer Programming 1",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ANY C++, JAVA",
                                                      "full" : "Computer Programming 2",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "MATH& 153",
                                                      "full" : "Calculus 3",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "MATH& 254",
                                                      "full" : "Calculus 3",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "UNI" :
                                    {
                                      "full" : "University Specific Requirements",
                                      "credits" : "10",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "PHYS, BIO, EARTH",
                                                      "full" : "Science with lab",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "PHYS& 223",
                                                      "full" : "Engineering Physics 3 with lab",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "ELE" :
                                    {
                                      "full" : "Electives",
                                      "credits" : "0",
                                      "classes" :
                                                [
                                                ]
                                    }


                            }
                 },




            


            "WSUT" : {
                    "abrev" : "WSUT",
                    "full" : "Washington State University Tri-cities",
                    "minCredits" : "90",
                    "reco" : "Recommends Discrete Structures. Discrete Structures is a certification course for computer science and as such is required for admittance to the computer science program. Recommends Macro or Micro economics to meet five credits of the social science requirement.",
                    "reqs" :
                            {
                              "COM" :
                                    {
                                      "full" : "Communication Skills",
                                      "credits" : "10",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "ENGL& 101",
                                                      "full" : "English Composition",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ENGL& 235",
                                                      "full" : "Technical Writing",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "QUA" :
                                    {
                                      "full" : "Quantitative / Symbolic Reasoning",
                                      "credits" : "5",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "MATH& 151",
                                                      "full" : "Calculus 1",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "HUM" :
                                    {
                                      "full" : "Humanities",
                                      "credits" : "15",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "ANY",
                                                      "full" : "",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ANY",
                                                      "full" : "",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ANY",
                                                      "full" : "",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "SOC" :
                                    {
                                      "full" : "Social Sciences",
                                      "credits" : "15",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "ANY",
                                                      "full" : "",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ANY",
                                                      "full" : "",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ANY",
                                                      "full" : "See recommendations",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "NAT" :
                                    {
                                      "full" : "Natural Sciences",
                                      "credits" : "15",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "PHYS& 221",
                                                      "full" : "Engineering Physics 1 with lab",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "PHYS& 222",
                                                      "full" : "Engineering Physics 2 with lab",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "MATH& 152",
                                                      "full" : "Calculus 2",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "MAJ" :
                                    {
                                      "full" : "Major Requirements",
                                      "credits" : "20",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "ANY C++",
                                                      "full" : "Computer Programming 1",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "ANY C++",
                                                      "full" : "Computer Programming 2",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "MATH& 153",
                                                      "full" : "Calculus 3",
                                                      "credits" : "5"
                                                    },
                                                    {
                                                      "abrev" : "MATH& 254",
                                                      "full" : "Calculus 3",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "UNI" :
                                    {
                                      "full" : "University Specific Requirements",
                                      "credits" : "10",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "PHYS, BIO, EARTH",
                                                      "full" : "Science with lab",
                                                      "credits" : "5"
                                                    },

                                                    {
                                                      "abrev" : "PHYS& 223",
                                                      "full" : "Engineering Physics 3 with lab",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    },
                                "ELE" :
                                    {
                                      "full" : "Electives",
                                      "credits" : "5",
                                      "classes" :
                                                [
                                                    {
                                                      "abrev" : "PHIL& 120",
                                                      "full" : "Symbolic Logic",
                                                      "credits" : "5"
                                                    }
                                                ]
                                    }


                            }
                 }
             }

         },


 "WWU" : {
        "abrev" : "WWU",
        "full" : "Western Washington University",
        "minCredits" : "90",
        "reco" : "",
        "reqs" :
                {
                  "COM" :
                        {
                          "full" : "Communication Skills",
                          "credits" : "10",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ENGL& 101",
                                          "full" : "English Composition",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ENGL& 235",
                                          "full" : "Technical Writing",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "QUA" :
                        {
                          "full" : "Quantitative / Symbolic Reasoning",
                          "credits" : "5",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "MATH& 151",
                                          "full" : "Calculus 1",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "HUM" :
                        {
                          "full" : "Humanities",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "SOC" :
                        {
                          "full" : "Social Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "NAT" :
                        {
                          "full" : "Natural Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS& 221",
                                          "full" : "Engineering Physics 1 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "PHYS& 222",
                                          "full" : "Engineering Physics 2 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "MATH& 152",
                                          "full" : "Calculus 2",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "MAJ" :
                        {
                          "full" : "Major Requirements",
                          "credits" : "15-20",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY C++, JAVA",
                                          "full" : "Computer Programming 1",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY C++, JAVA",
                                          "full" : "Computer Programming 2",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev1" : "MATH& 153",
                                          "abrev2" : "MATH& 254",
                                          "full" : "Calculus 3",
                                          "credits" : "10",
                                          "or" : "true"
                                        },
                                        {
                                          "abrev" : "MATH& 163",
                                          "full" : "Calculus 3",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "UNI" :
                        {
                          "full" : "University Specific Requirements",
                          "credits" : "10",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS, BIO, EARTH",
                                          "full" : "Science with lab",
                                          "credits" : "5"
                                        },
                                    
                                        {
                                          "abrev" : "PHYS& 223",
                                          "full" : "Engineering Physics 3 with lab",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "ELE" :
                        {
                          "full" : "Electives",
                          "credits" : "0-5",
                          "classes" :
                                    [
                                    ]
                        }


                }
     },
   
     
"GU" : {
        "abrev" : "GU",
        "full" : "Gonzaga University",
        "minCredits" : "90",
        "reco" : "Recommends Calculus 4, Critical Thinking (Symbolic Logic), Differential Equations, and Intro to Literature to fulfill graduation requirements.",
        "reqs" :
                {
                  "COM" :
                        {
                          "full" : "Communication Skills",
                          "credits" : "10",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ENGL& 101",
                                          "full" : "English Composition",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ENGL& 235",
                                          "full" : "Technical Writing",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "QUA" :
                        {
                          "full" : "Quantitative / Symbolic Reasoning",
                          "credits" : "5",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "MATH& 151",
                                          "full" : "Calculus 1",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "HUM" :
                        {
                          "full" : "Humanities",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHIL& 101",
                                          "full" : "Philosophy",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "CMST& 101",
                                          "full" : "Communications",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ETHICS",
                                          "full" : "Ethics",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "SOC" :
                        {
                          "full" : "Social Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "NAT" :
                        {
                          "full" : "Natural Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS& 221",
                                          "full" : "Engineering Physics 1 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "PHYS& 222",
                                          "full" : "Engineering Physics 2 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "MATH& 152",
                                          "full" : "Calculus 2",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "MAJ" :
                        {
                          "full" : "Major Requirements",
                          "credits" : "15-20",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY C++, JAVA",
                                          "full" : "Computer Programming 1",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY C++, JAVA",
                                          "full" : "Computer Programming 2",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev1" : "MATH& 153",
                                          "abrev2" : "MATH& 254",
                                          "full" : "Calculus 3",
                                          "credits" : "10",
                                          "or" : "true"
                                        },
                                        {
                                          "abrev" : "MATH& 163",
                                          "full" : "Calculus 3",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "UNI" :
                        {
                          "full" : "University Specific Requirements",
                          "credits" : "10",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "MATH",
                                          "full" : "Discrete Math",
                                          "credits" : "5"
                                        },
                                    
                                        {
                                          "abrev" : "PHYS& 223",
                                          "full" : "Engineering Physics 3 with lab",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "ELE" :
                        {
                          "full" : "Electives",
                          "credits" : "0-5",
                          "classes" :
                                    [
                                    ]
                        }


                }
     },
    
     
"HU" : {
        "abrev" : "HU",
        "full" : "Heritage University",
        "minCredits" : "90",
        "reco" : "Discrete Math and Statistics will be evaluated for comparability to Heritage's SPSC 231 and Math 221 courses. (Other lower level courses taken by Computer Science majors, which may need to be taken prior to graduation. Similar courses taken at other institutions will be evaluated at time of transfer and credit may be applied towards major, general education or electives as appropriate).",
        "reqs" :
                {
                  "COM" :
                        {
                          "full" : "Communication Skills",
                          "credits" : "10",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ENGL& 101",
                                          "full" : "English Composition",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ENGL& 235",
                                          "full" : "Technical Writing",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "QUA" :
                        {
                          "full" : "Quantitative / Symbolic Reasoning",
                          "credits" : "5",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "MATH& 151",
                                          "full" : "Calculus 1",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "HUM" :
                        {
                          "full" : "Humanities",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "SOC" :
                        {
                          "full" : "Social Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "NAT" :
                        {
                          "full" : "Natural Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS& 221",
                                          "full" : "Engineering Physics 1 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "PHYS& 222",
                                          "full" : "Engineering Physics 2 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "MATH& 152",
                                          "full" : "Calculus 2",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "MAJ" :
                        {
                          "full" : "Major Requirements",
                          "credits" : "15-20",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY JAVA",
                                          "full" : "Computer Programming 1",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY JAVA",
                                          "full" : "Computer Programming 2",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev1" : "MATH& 153",
                                          "abrev2" : "MATH& 254",
                                          "full" : "Calculus 3",
                                          "credits" : "10",
                                          "or" : "true"
                                        },
                                        {
                                          "abrev" : "MATH& 163",
                                          "full" : "Calculus 3",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "UNI" :
                        {
                          "full" : "University Specific Requirements",
                          "credits" : "5",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS& 223",
                                          "full" : "Engineering Physics 3 with lab",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "ELE" :
                        {
                          "full" : "Electives",
                          "credits" : "5-10",
                          "classes" :
                                    [
                                    ]
                        }


                }
     },
    
    
"PLU" : {
        "abrev" : "PLU",
        "full" : "Pacific Lutheran University",
        "minCredits" : "90",
        "reco" : "Intro to CS, Digital Systems, Data Structures, Statistics, and Discrete Structures will be evaluated for comparability to PLU's, CSCE 144, 231, 270, and Math 242, 245 courses. (Other lower level courses taken by Computer Science majors, which may need to be taken prior to graduation. Similar courses taken at other institutions will be evaluated at time of transfer and credit may be applied towards major, general education or electives as appropriate).",
        "reqs" :
                {
                  "COM" :
                        {
                          "full" : "Communication Skills",
                          "credits" : "10",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ENGL& 101",
                                          "full" : "English Composition",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ENGL& 235",
                                          "full" : "Technical Writing",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "QUA" :
                        {
                          "full" : "Quantitative / Symbolic Reasoning",
                          "credits" : "5",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "MATH& 151",
                                          "full" : "Calculus 1",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "HUM" :
                        {
                          "full" : "Humanities",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "SOC" :
                        {
                          "full" : "Social Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "NAT" :
                        {
                          "full" : "Natural Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS& 221",
                                          "full" : "Engineering Physics 1 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "PHYS& 222",
                                          "full" : "Engineering Physics 2 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "MATH& 152",
                                          "full" : "Calculus 2",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "MAJ" :
                        {
                          "full" : "Major Requirements",
                          "credits" : "15-20",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY C++, JAVA",
                                          "full" : "Computer Programming 1",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY C++, JAVA",
                                          "full" : "Computer Programming 2",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev1" : "MATH& 153",
                                          "abrev2" : "MATH& 254",
                                          "full" : "Calculus 3",
                                          "credits" : "10",
                                          "or" : "true"
                                        },
                                        {
                                          "abrev" : "MATH& 163",
                                          "full" : "Calculus 3",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "UNI" :
                        {
                          "full" : "University Specific Requirements",
                          "credits" : "5",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS, BIO, EARTH",
                                          "full" : "Science with lab",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "ELE" :
                        {
                          "full" : "Electives",
                          "credits" : "5-10",
                          "classes" :
                                    [
                                    ]
                        }


                }
     },
    
    
"SPU" : {
        "abrev" : "SPU",
        "full" : "Seattle Pacific University",
        "minCredits" : "90",
        "reco" : "Prefers C++ but accepts Java with SPU bridge course. Math& 153 will be evaluated for comparability to SPU's Math 1236. (Other lower level courses taken by Computer Science majors, which may need to be taken prior to graduation. Similar courses taken at other institutions will be evaluated at time of transfer and credit may be applied towards major, general education or electives as appropriate).",
        "reqs" :
                {
                  "COM" :
                        {
                          "full" : "Communication Skills",
                          "credits" : "10",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ENGL& 101",
                                          "full" : "English Composition",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ENGL& 235",
                                          "full" : "Technical Writing",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "QUA" :
                        {
                          "full" : "Quantitative / Symbolic Reasoning",
                          "credits" : "5",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "MATH& 151",
                                          "full" : "Calculus 1",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "HUM" :
                        {
                          "full" : "Humanities",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "SOC" :
                        {
                          "full" : "Social Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "NAT" :
                        {
                          "full" : "Natural Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS& 221",
                                          "full" : "Engineering Physics 1 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "PHYS& 222",
                                          "full" : "Engineering Physics 2 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "MATH& 152",
                                          "full" : "Calculus 2",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "MAJ" :
                        {
                          "full" : "Major Requirements",
                          "credits" : "15-20",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY C++, JAVA",
                                          "full" : "See recommendations.",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY C++, JAVA",
                                          "full" : "See recommendations",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev1" : "MATH& 153",
                                          "abrev2" : "MATH& 254",
                                          "full" : "Calculus 3",
                                          "credits" : "10",
                                          "or" : "true"
                                        },
                                        {
                                          "abrev" : "MATH& 163",
                                          "full" : "Calculus 3",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "UNI" :
                        {
                          "full" : "University Specific Requirements",
                          "credits" : "5",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS, BIO, EARTH",
                                          "full" : "Science with lab",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "ELE" :
                        {
                          "full" : "Electives",
                          "credits" : "5-10",
                          "classes" :
                                    [
                                    ]
                        }


                }
     },
    
    
"SU" : {
        "abrev" : "SU",
        "full" : "Seattle University",
        "minCredits" : "90",
        "reco" : "Programming and Problem Solving 1 and 2 will be evaluated for comparability to CPSC 1420 and 1430 courses. (Other lower level courses taken by Computer Science majors, which may need to be taken prior to graduation. Similar courses taken at other institutions will be evaluated at time of transfer and credit may be applied towards major, general education or electives as appropriate).",
        "reqs" :
                {
                  "COM" :
                        {
                          "full" : "Communication Skills",
                          "credits" : "10",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ENGL& 101",
                                          "full" : "English Composition",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ENGL& 235",
                                          "full" : "Technical Writing",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "QUA" :
                        {
                          "full" : "Quantitative / Symbolic Reasoning",
                          "credits" : "5",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "MATH& 151",
                                          "full" : "Calculus 1",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "HUM" :
                        {
                          "full" : "Humanities",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "SOC" :
                        {
                          "full" : "Social Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "NAT" :
                        {
                          "full" : "Natural Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS& 221",
                                          "full" : "Engineering Physics 1 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "PHYS& 222",
                                          "full" : "Engineering Physics 2 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "MATH& 152",
                                          "full" : "Calculus 2",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "MAJ" :
                        {
                          "full" : "Major Requirements",
                          "credits" : "15-20",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY C++, JAVA",
                                          "full" : "Computer Programming 1",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY C++, JAVA",
                                          "full" : "Computer Programming 2",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev1" : "MATH& 153",
                                          "abrev2" : "MATH& 254",
                                          "full" : "Calculus 3",
                                          "credits" : "10",
                                          "or" : "true"
                                        },
                                        {
                                          "abrev" : "MATH& 163",
                                          "full" : "Calculus 3",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "UNI" :
                        {
                          "full" : "University Specific Requirements",
                          "credits" : "5",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS, BIO, EARTH",
                                          "full" : "Science with lab",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "ELE" :
                        {
                          "full" : "Electives",
                          "credits" : "5-10",
                          "classes" :
                                    [
                                    ]
                        }


                }
     },
    
    
"WU" : {
        "abrev" : "WU",
        "full" : "Whitworth University",
        "minCredits" : "90",
        "reco" : "Recommends electives include one Fine Art and one course fulfilling \"American Diversity\".",
        "reqs" :
                {
                  "COM" :
                        {
                          "full" : "Communication Skills",
                          "credits" : "10",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ENGL& 101",
                                          "full" : "English Composition",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ORAL",
                                          "full" : "Oral Communication",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "QUA" :
                        {
                          "full" : "Quantitative / Symbolic Reasoning",
                          "credits" : "5",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "MATH& 151",
                                          "full" : "Calculus 1",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "HUM" :
                        {
                          "full" : "Humanities",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "SOC" :
                        {
                          "full" : "Social Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY",
                                          "full" : "",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "NAT" :
                        {
                          "full" : "Natural Sciences",
                          "credits" : "15",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS& 221",
                                          "full" : "Engineering Physics 1 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "PHYS& 222",
                                          "full" : "Engineering Physics 2 with lab",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "MATH& 152",
                                          "full" : "Calculus 2",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "MAJ" :
                        {
                          "full" : "Major Requirements",
                          "credits" : "15-20",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY C++, JAVA",
                                          "full" : "Computer Programming 1",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev" : "ANY C++, JAVA",
                                          "full" : "Computer Programming 2",
                                          "credits" : "5"
                                        },
                                        {
                                          "abrev1" : "MATH& 153",
                                          "abrev2" : "MATH& 254",
                                          "full" : "Calculus 3",
                                          "credits" : "10",
                                          "or" : "true"
                                        },
                                        {
                                          "abrev" : "MATH& 163",
                                          "full" : "Calculus 3",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "UNI" :
                        {
                          "full" : "University Specific Requirements",
                          "credits" : "5",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "PHYS& 223",
                                          "full" : "Engineering Physics 3 with lab",
                                          "credits" : "5"
                                        }
                                    ]
                        },
                    "ELE" :
                        {
                          "full" : "Electives",
                          "credits" : "5-10",
                          "classes" :
                                    [
                                        {
                                          "abrev" : "ANY",
                                          "full" : "See recommendations",
                                          "credits" : "5"
                                        }
                                    ]
                        }


                }
     }
};
































    
});