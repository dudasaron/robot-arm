import RobotArm from './lib/robotarm/robotarm.js'
import ArmConfig from './lib/robotarm/armconfiguration.js';
import RelayConnection from './lib/utils/relayconnection.js';

import * as algebra from './lib/geometry/algebra.js';

import * as ArmDisplay from './lib/utils/armdisplay.js';
import ArmState from './lib/robotarm/armstate.js';

// ------------- Relay Connection -------------
let relay = new RelayConnection();
relay.addEventListener('disconnected', onDisconnect);    
relay.addEventListener('connected', onConnect);

function connect(url) {
    relay.connectionString = url;
    relay.connect();
}

function onConnect() {
    $('#send-controls-btn').prop('disabled', false);
}

function onDisconnect() {
    $('#send-controls-btn').prop('disabled', true);
}

$(document).ready(() => {
    $('#ws-connect-btn').on('click', function() {
        connect($('#url').val())
    });
});

function send() {
    if (!relay.connected)
        throw "Not connected.";

    var data = {
            base: parseInt($('#base').val()),
            shoulder: parseInt($('#shoulder').val()),
            elbow: parseInt($('#elbow').val()),
            wrist: parseInt($('#wrist').val()),
            actuator: $('#actuator').is(':checked') ? 1 : 0,
        };

    relay.send(data)
}


// ------------- Controls -------------

let arm = new RobotArm(
                new ArmConfig(
                    {x: 0, y: 0, z: 0.9},
                    {x: 0, y: -0.207, z: 0.117},
                    {x: 0, y: 0, z: 1.35},
                    {x: 0, y: 0, z: 0.90},
                    {x: 0, y: 0, z: 0.45},
                    0,
                    algebra.degToRad(98),
                    algebra.degToRad(90),
                    algebra.degToRad(142),
                    false,
                    true,
                    true,
                    true,
                ), 
                new ArmState(Math.PI/2, 0, 0, 0, 0)
            );
//arm.touchPoint(1, 1, 0);
let autosend = false;

$(document).ready(() => {
    $('#autosend').on('change', function() {
        autosend = $(this).is(':checked');
    });
});


// ------------- Display -------------
const context = document.getElementById('platform-canvas').getContext('2d');
context.fillStyle = '#fff';
context.fillRect(0, 0, 400, 400);

for (let i = 0; i <= 400; i += 4) {
    context.strokeStyle = i % 40 === 0 ? '#303030' : '#afafaf';
    context.beginPath();
    context.moveTo(i, 0);
    context.lineTo(i, 400);
    context.moveTo(0, i);
    context.lineTo(400, i);
    context.stroke();
}

context.fillStyle = '#000';
context.fillRect(0, 190, 20, 20);

ArmDisplay.initDisplay(arm, document.getElementById('render-canvas'), document.getElementById('platform-canvas'));

function updatePreview(id) {
    if ($('#' + id).attr('type') == 'range') {
        $('#' + id + '_prev').html(($('#' + id).val()));
    } else {
        $('#' + id + '_prev').html(($('#' + id).is(':checked') ? 'On' : 'Off'));
    }

    updateDisplay();

    if (autosend)
        send();
}


function updateDisplay() {
    arm.state.baseRotationDegree = parseInt($('#base').val());
    arm.state.shoulderRotationDegree = parseInt($('#shoulder').val());
    arm.state.elbowRotationDegree = parseInt($('#elbow').val());
    arm.state.wristRotationDegree = parseInt($('#wrist').val());
    arm.state.actuatorState = $('#actuator').is(':checked') ? 1 : 0;

    ArmDisplay.redraw();
}


// ------------- Keyboard controls -------------

$(document).on('keypress', function(e) {
    e.preventDefault();
    var shouldSend = true;
    switch (e.originalEvent.key) {
        case 'a':
            $('#base').val(parseInt($('#base').val()) - 1);
            break;
        case 'd':
            $('#base').val(parseInt($('#base').val()) + 1);
            break;
        case 's':
            $('#shoulder').val(parseInt($('#shoulder').val()) - 1);
            break;
        case 'w':
            $('#shoulder').val(parseInt($('#shoulder').val()) + 1);
            break;
        case 'q':
            $('#elbow').val(parseInt($('#elbow').val()) - 1);
            break;
        case 'e':
            $('#elbow').val(parseInt($('#elbow').val()) + 1);
            break;
        case 'Q':
            $('#wrist').val(parseInt($('#wrist').val()) - 1);
            break;
        case 'E':
            $('#wrist').val(parseInt($('#wrist').val()) + 1);
            break;
        case 'r':
        case 'R':
            $('#actuator').prop('checked', $('#actuator').is(':checked') ? '' : 'checked');
            break;
        default: shouldSend = false; break;
    }
    if (shouldSend) {
        send();
    }
});


// ------------- Init -------------

$(document).ready(function() {


    $('#actuator, input[type=range]').on('input', function() {
        updatePreview($(this).attr('id'));
    });

    $('#actuator').each(function() {
        //updatePreview($(this).attr('id'));
    });

    $('#send-controls-btn').on('click', send);

});
