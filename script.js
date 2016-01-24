(function(){
    'use strict';

    var interval,
        Counter = {
            step: 1000,
            state: 0,
            tick: function(){
                Counter.state += Counter.step;
                $('#counter').html(Counter.format());
            },
            format: function() {
                var min = Counter.pad(Math.floor((Counter.state / 60000) % 60)),
                    sec = Counter.pad(((Counter.state / 1000) % 60));
                return min + ':' + sec;
            },
            pad: function(orig){
                return ('0' + orig).slice(-2);
            }
        },
        Game = {
        running: false,
        scores: [0, 0, 0, 0, 0],

        pause: function(){
            this.running = false;

            clearInterval(interval);
        },
        resume: function(){
            this.running = true;

            interval = setInterval(Counter.tick, Counter.step);
        }
    };

    $(document).on('keypress', function(e){
        console.log('Pressed', e.keyCode);

        switch (e.keyCode) {
            case 32:
                if (Game.running) {
                    Game.pause();
                }else{
                    Game.resume();
                }
                break;
        }
    });

})();
