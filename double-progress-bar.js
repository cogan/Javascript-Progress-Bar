/**
 * @author: Cogan Noll <colgate360@gmail.com>
 *
 * @require: jquery
 *
 * Public API:
 *  setFrontBarTo(ticks)
 *  setBackBarTo(ticks)
 *  fillFrontBarTo(ticks, fillSpeed, onTick, onFillComplete)
 *  fillBackBarTo(ticks, fillSpeed, onTick, onFillComplete)
 *  isFrontBarFull()
 *  isBackBarFull()
 *  stopFrontBar()
 *  stopBackBar()
 *  stop()
 */

function DoubleProgressBar(container, back, front)
{
  /**
   * constructor
   */
  this.container = container;
  this.maxTicks = 100;
  
  this.frontBar = function() {};
  this.backBar = function() {};
  this.frontBar.name = front;
  this.backBar.name = back;
  this.frontBar.currentTicks = 0;
  this.backBar.currentTicks = 0; 
  this.frontBar.lock = 0;
  this.backBar.lock = 0;

  /**
   * set bar to specified number of ticks
   */
  this.setBarTo = function(bar, ticks){
    ticks = this.checkBounds(ticks);
    $('#'+bar.name).css('width', this.ticksToPxStr(ticks));
    bar.currentTicks = ticks;
  }
  
  this.setFrontBarTo = function(ticks){
    ++this.frontBar.lock;
    this.setBarTo(this.frontBar, ticks);
  }

  this.setBackBarTo = function(ticks){
    ++this.backBar.lock;
    this.setBarTo(this.backBar, ticks);
  }

  /**
   * fill (animate) bar until it reaches the specified number of ticks
   */
  this.fillFrontBarTo = function(ticks, fillSpeed, onTick, onFillComplete){
    ++this.frontBar.lock;
    onTick = typeof(a) != 'undefined' ? onTick : function(){};
    onFillComplete = typeof(a) != 'undefined' ? onFillComplete : function(){};
    this.doFillBarTo(this, this.frontBar, ticks, 
        this.fillSpeedToDelay(fillSpeed), onTick, onFillComplete, this.frontBar.lock);
  }
  
  this.fillBackBarTo = function(ticks, fillSpeed, onTick, onFillComplete){
    ++this.backBar.lock;
    onTick = typeof(a) != 'undefined' ? onTick : function(){};
    onFillComplete = typeof(a) != 'undefined' ? onFillComplete : function(){};
    this.doFillBarTo(this, this.backBar, ticks, 
        this.fillSpeedToDelay(fillSpeed), onTick, onFillComplete, this.backBar.lock);
  }

  /**
   * function to fill a bar, calls itself recursively.
   */
  this.doFillBarTo = function(obj, bar, ticks, delay, onTick, onFillComplete, lock) {
    if (lock == bar.lock)
    {
      ticks = obj.checkBounds(ticks);
      var currentWidthPx = parseInt($('#'+bar.name).css('width'), 10);
      var targetWidthPx = obj.ticksToPx(ticks);
      if (currentWidthPx < targetWidthPx){
        var updatedWidthPx = currentWidthPx + 1;
      }else{
        var updatedWidthPx = currentWidthPx - 1;
      }
  
      if (currentWidthPx != targetWidthPx){
        $('#'+bar.name).css('width', updatedWidthPx+'px');
        bar.currentTicks = obj.pxToTicks(updatedWidthPx);
  
        // call the onTick method
        onTick();
  
        // we can't pass in a function with arguments to setTimeout
        // so we create a closure
        var doFill = function() { obj.doFillBarTo(obj, bar, ticks, delay, onTick, onFillComplete, lock); };
        setTimeout(doFill, delay);
      }
      else
      {
        // we're done filling
        onFillComplete();
      }
    }
  }

  /**
   * check if the progress bar is full
   */
  this.isBarFull = function(bar){
    var containerWidthPx = parseInt($('#'+this.container).css('width'), 10);
    var barWidthPx = parseInt($('#'+bar.name).css('width'), 10);
    if (barWidthPx < containerWidthPx){
      return false;
    }else{
      return true;
    }
  }
  
  this.isFrontBarFull = function(){
    return this.isBarFull(this.frontBar);
  }
  
  this.isBackBarFull = function(){
    return this.isBarFull(this.backBar);
  }

  /**
   * stop all animation for a bar
   */
  this.stopBar = function(bar){
    ++bar.lock;
  }

  this.stopFrontBar = function(){
    this.stopBar(this.frontBar);
  }
  
  this.stopBackBar = function(){
    this.stopBar(this.backBar);
  }

  this.stop = function(){
    this.stopBar(this.frontBar);
    this.stopBar(this.backBar);
  }
  
  /**
   * helper functions to convert from ticks to pixels and vice versa
   */
  this.ticksToPx = function(ticks){
    var pxPerTx = parseFloat($('#'+this.container).css('width')) / this.maxTicks;
    px = ticks * pxPerTx;
    return px;
  }

  this.ticksToPxStr = function(ticks){
    var pxStr = this.ticksToPx(ticks)+'px';
    return pxStr;
  }
  
  this.pxToTicks = function(px){
    var ticksPerPx = this.maxTicks / parseFloat($('#'+this.container).css('width'));
    ticks = px * ticksPerPx;
    return ticks;
  }
  
  this.fillSpeedToDelay = function(ticksPerSecond){
    var pxPerTick = parseFloat($('#'+this.container).css('width')) / this.maxTicks;
    pxPerSecond = parseInt( (1000 / (pxPerTick * ticksPerSecond)), 10);
    return pxPerSecond;
  }

  /**
   * helper function to check that we don't set our bar size out of bounds
   */
  this.checkBounds = function(ticks){
    if (ticks <= 0){
      ticks = 0;
    }else if (ticks >= this.maxTicks){
      ticks = this.maxTicks;
    }
    return ticks;
  }
}
