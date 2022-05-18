var InputMask = function ( opts ) {
  if ( opts && opts.masked ) {
    // Make it easy to wrap this plugin and pass elements instead of a selector
    opts.masked = typeof opts.masked === 'string' ? document.querySelectorAll( opts.masked ) : opts.masked;
  }

  if ( opts ) {
    this.opts = {
      masked: opts.masked || document.querySelectorAll( this.d.masked ),
      mNum: opts.mNum || this.d.mNum,
      mChar: opts.mChar || this.d.mChar,
      error: opts.onError || this.d.onError
    }
  } else {
    this.opts = this.d;
    this.opts.masked = document.querySelectorAll( this.opts.masked );
  }

  this.refresh( true );
};

var inputMask = {

  // Default Values
  d: {
    masked : '.masked',
    mNum : 'XdDmMyY90',
    mChar : '_',
    onError: function(){}
  },

  refresh: function(init) {
    var t, parentClass;

    if ( !init ) {
      this.opts.masked = document.querySelectorAll( this.opts.masked );
    }

    for(i = 0; i < this.opts.masked.length; i++) {
      t = this.opts.masked[i]
      parentClass = t.parentNode.getAttribute('class');

      if ( !parentClass || ( parentClass && parentClass.indexOf('shell') === -1 ) ) {
        this.createShell(t);
        this.activateMasking(t);
      }
    }
  },

  // replaces each masked t with a shall containing the t and it's mask.
  createShell : function (t) {
    var wrap = document.createElement('span'),
        mask = document.createElement('span'),
        emphasis = document.createElement('i'),
        tClass = t.getAttribute('class'),
        pTxt = t.getAttribute('placeholder'),
        placeholder = document.createTextNode(pTxt);

    t.setAttribute('maxlength', placeholder.length);
    t.setAttribute('data-placeholder', pTxt);
    t.removeAttribute('placeholder');


    if ( !tClass || ( tClass && tClass.indexOf('masked') === -1 ) ) {
      t.setAttribute( 'class', tClass + ' masked');
    }

    mask.setAttribute('aria-hidden', 'true');
    mask.setAttribute('id', t.getAttribute('id') + 'Mask');
    mask.appendChild(emphasis);
    mask.appendChild(placeholder);

    wrap.setAttribute('class', 'shell');
    wrap.appendChild(mask);
    t.parentNode.insertBefore( wrap, t );
    wrap.appendChild(t);
  },

  setValueOfMask : function (e) {
    var value = e.target.value,
        placeholder = e.target.getAttribute('data-placeholder');

    return "<i>" + value + "</i>" + placeholder.substr(value.length);
  },

  // add event listeners
  activateMasking : function (t) {
    var that = this;
    if (t.addEventListener) { // remove "if" after death of IE 8
      t.addEventListener('keyup', function(e) {
        that.handleValueChange.call(that,e);
      }, false);
    } else if (t.attachEvent) { // For IE 8
        t.attachEvent('onkeyup', function(e) {
        e.target = e.srcElement;
        that.handleValueChange.call(that, e);
      });
    }
  },

  handleValueChange : function (e) {
    var id = e.target.getAttribute('id');

    if(e.target.value == document.querySelector('#' + id + 'Mask i').innerHTML) {
      return; // Continue only if value hasn't changed
    }

    document.getElementById(id).value = this.handleCurrentValue(e);
    document.getElementById(id + 'Mask').innerHTML = this.setValueOfMask(e);

  },

  handleCurrentValue : function (e) {
    var isCharsetPresent = e.target.getAttribute('data-charset'),
        placeholder = isCharsetPresent || e.target.getAttribute('data-placeholder'),
        value = e.target.value, l = placeholder.length, newValue = '',
        i, j, isInt, isLetter, strippedValue;

    // strip special characters
    strippedValue = isCharsetPresent ? value.replace(/\W/g, "") : value.replace(/\D/g, "");

    for (i = 0, j = 0; i < l; i++) {
        isInt = !isNaN(parseInt(strippedValue[j]));
        isLetter = strippedValue[j] ? strippedValue[j].match(/[A-Z]/i) : false;
        matchesNumber = this.opts.mNum.indexOf(placeholder[i]) >= 0;
        matchesLetter = this.opts.mChar.indexOf(placeholder[i]) >= 0;
        if ((matchesNumber && isInt) || (isCharsetPresent && matchesLetter && isLetter)) {
                newValue += strippedValue[j++];
          } else if ((!isCharsetPresent && !isInt && matchesNumber) || (isCharsetPresent && ((matchesLetter && !isLetter) || (matchesNumber && !isInt)))) {
                //this.opts.onError( e ); // write your own error handling function
                return newValue;
        } else {
            newValue += placeholder[i];
        }
        // break if no characters left and the pattern is non-special character
        if (strippedValue[j] == undefined) {
          break;
        }
    }
    if (e.target.getAttribute('data-valid-example')) {
      return this.validateProgress(e, newValue);
    }
    return newValue;
  },

  validateProgress : function (e, value) {
    var validExample = e.target.getAttribute('data-valid-example'),
        pattern = new RegExp(e.target.getAttribute('pattern')),
        placeholder = e.target.getAttribute('data-placeholder'),
        l = value.length, testValue = '';

    //convert to months
    if (l == 1 && placeholder.toUpperCase().substr(0,2) == 'MM') {
      if(value > 1 && value < 10) {
        value = '0' + value;
      }
      return value;
    }
    // test the value, removing the last character, until what you have is a submatch
    for ( i = l; i >= 0; i--) {
      testValue = value + validExample.substr(value.length);
      if (pattern.test(testValue)) {
        return value;
      } else {
        value = value.substr(0, value.length-1);
      }
    }

    return value;
  }
};

for ( var property in inputMask ) {
  if (inputMask.hasOwnProperty(property)) {
    InputMask.prototype[ property ] = inputMask[ property ];
  }
}

//  Declaritive initalization
(function(){
  var scripts = document.getElementsByTagName('script'),
      script = scripts[ scripts.length - 1 ];
  if ( script.getAttribute('data-autoinit') ) {
    new InputMask();
  }
})();


/********** Credit card back space *************/
input_credit_card = function(jQinp)
{
    var format_and_pos = function(input, char, backspace)
    {
        var start = 0;
        var end = 0;
        var pos = 0;
        var value = input.value;

        if (char !== false)
        {
            start = input.selectionStart;
            end = input.selectionEnd;

            if (backspace && start > 0) // handle backspace onkeydown
            {
                start--;

                if (value[start] == " ")
                { start--; }
            }
            // To be able to replace the selection if there is one
            value = value.substring(0, start) + char + value.substring(end);

            pos = start + char.length; // caret position
        }

        var d = 0; // digit count
        var dd = 0; // total
        var gi = 0; // group index
        var newV = "";
        var groups = /^\D*3[47]/.test(value) ? // check for American Express
        [4, 6, 5] : [4, 4, 4, 4];

        for (var i = 0; i < value.length; i++)
        {
            if (/\D/.test(value[i]))
            {
                if (start > i)
                { pos--; }
            }
            else
            {
                if (d === groups[gi])
                {
                    newV += " ";
                    d = 0;
                    gi++;

                    if (start >= i)
                    { pos++; }
                }
                newV += value[i];
                d++;
                dd++;
            }
            if (d === groups[gi] && groups.length === gi + 1) // max length
            { break; }
        }
        input.value = newV;

        if (char !== false)
        { input.setSelectionRange(pos, pos); }
    };

    jQinp.keypress(function(e)
    {
        var code = e.charCode || e.keyCode || e.which;

        // Check for tab and arrow keys (needed in Firefox)
        if (code !== 9 && (code < 37 || code > 40) &&
        // and CTRL+C / CTRL+V
        !(e.ctrlKey && (code === 99 || code === 118)))
        {
            e.preventDefault();

            var char = String.fromCharCode(code);

            // if the character is non-digit
            // -> return false (the character is not inserted)

            if (/\D/.test(char))
            { return false; }

            format_and_pos(this, char);
        }
    }).
    keydown(function(e) // backspace doesn't fire the keypress event
    {
        if (e.keyCode === 8 || e.keyCode === 46) // backspace or delete
        {
            e.preventDefault();
            format_and_pos(this, '', this.selectionStart === this.selectionEnd);
        }
    }).
    on('paste', function()
    {
        // A timeout is needed to get the new value pasted
        setTimeout(function()
        { format_and_pos(jQinp[0], ''); }, 50);
    }).
    blur(function() // reformat onblur just in case (optional)
    {
        format_and_pos(this, false);
    });
};

input_credit_card($('#cc'));