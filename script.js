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
        operation: {
            operator: null,
            player: null,
            value: null
        },
        scores: [0, 0, 0, 0, 0],

        pause: function(){
            this.running = false;

            clearInterval(interval);
        },
        resume: function(){
            this.running = true;

            interval = setInterval(Counter.tick, Counter.step);
        },
        addScore: function(player, value){
            Game.scores[player - 1] += value;

            $('.score' + player).html(Game.formatScore(Game.scores[player - 1]));
            $('div[class^=score]').removeClass('active');
        },
        formatScore: function(score){
            return (score || 0).toLocaleString('de', { maximumFractionDigits:0 }) + '$';
        },
        setModifierValue: function(){
            var text = '';
            if (Game.operation.operator !== null) {
                text = Game.operation.operator + Game.formatScore(Game.operation.value);
            }
            $('.scoreModifier').html(text);
        }
    };

    Game.addScore(1, 0);
    Game.addScore(2, 0);
    Game.addScore(3, 0);
    Game.addScore(4, 0);
    Game.addScore(5, 0);

    $(document).on('keydown', function(e){
        if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
            return true;
        }
        e.preventDefault();
        console.log('Pressed', e.keyCode);

        switch (e.keyCode) {
            case 8: // Backspace
                if(Game.operation.player !== null && Game.operation.operator !== null && Game.operation.value !== null){
                    Game.operation.value = Math.floor(Game.operation.value / 10);
                }
                if(Game.operation.value < 0){
                    Game.operation.value = 0;
                }

                Game.setModifierValue();
                break;
            case 13: // Enter
                if(Game.operation.player !== null && Game.operation.operator !== null && Game.operation.value !== null){
                    if(Game.operation.operator === '-'){
                        Game.operation.value *= -1;
                    }

                    Game.addScore(Game.operation.player, Game.operation.value);

                    Game.operation.player = null;
                    Game.operation.operator = null;
                    Game.operation.value = null;

                    Game.setModifierValue();
                }
                break;
            case 27: // Escape
                Game.operation.player = null;
                Game.operation.operator = null;
                Game.operation.value = null;

                Game.setModifierValue();

                $('div[class^=score]').removeClass('active');
                break;
            case 32: // Space
                if (Game.running) {
                    Game.pause();
                }else{
                    Game.resume();
                }
                break;
            case 43: // +
            case 107:
                if(Game.operation.player !== null){
                    Game.operation.operator = '+';
                    Game.setModifierValue();
                }
                break;
            case 45: // -
            case 109:
                if(Game.operation.player !== null){
                    Game.operation.operator = '-';
                    Game.setModifierValue();
                }
                break;
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
                if(Game.operation.player === null && [49, 50, 51, 52, 53].indexOf(e.keyCode) > -1){
                    Game.operation.player = e.keyCode - 48;
                    $('.score' + Game.operation.player).addClass('active');
                }
                if(Game.operation.operator !== null){
                    if(Game.operation.value === null){
                        Game.operation.value = e.keyCode - 48;
                    }else {
                        Game.operation.value = parseInt((Game.operation.value + '') + (e.keyCode - 48));
                    }
                }

                Game.setModifierValue();
                break;
            case 96:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
                var key = e.keyCode - 48;
                $(document).trigger({type: 'keydown', which: key, keyCode: key});
        }
        console.log(Game.operation);
        return false;
    });

})();
