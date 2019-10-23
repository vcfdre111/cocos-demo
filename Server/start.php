<?php

use Workerman\Worker;
use Workerman\Lib\Timer;

require_once __DIR__  . './Autoloader.php';

// 创建一个Worker监听2346端口，使用websocket协议通讯
$ws_worker = new Worker("websocket://0.0.0.0:2346");

$global_uid = 0;

$ws_worker->count = 1;

$severTime = 1;

$timeCountdown = 0;

$winner = -1;

$pokerCard = [-1, -1];

$funds = 5000;

$playerdata = array();

$totalBet = array(0, 0, 0);


$ws_worker->onWorkerStart = function ($worker) {

    Timer::add(1, function () use ($worker) {
        global $severTime, $timeCountdown, $pokerCard, $playerdata;
        $message = [];
        if ($severTime % 28 == 0) {
            $timeCountdown = 3;
            foreach ($worker->connections as $connection) {
                $message = ['commend' => 'change stage', 'stage' => 'waiting'];
                $connection->send(json_encode($message));
            }
            print_r($playerdata);
        } else if ($severTime % 28 == 4) {
            $timeCountdown = 10;
            foreach ($worker->connections as $connection) {
                $message = ['commend' => 'change stage', 'stage' => 'bet'];
                $connection->send(json_encode($message));
            }
        } else if ($severTime % 28 == 15) {
            $timeCountdown = 1;
            $pokerCard = createCard();
            foreach ($worker->connections as $connection) {
                $message = ['commend' => 'result card', 'card' => $pokerCard];
                $connection->send(json_encode($message));
                $message = ['commend' => 'change stage', 'stage' => 'bet end'];
                $connection->send(json_encode($message));
            }
            cardResult();
        } else if ($severTime % 28 == 17) {
            dealWithMoney();
            $timeCountdown = 8;
            foreach ($worker->connections as $connection) {
                $message = ['commend' => 'change stage', 'stage' => 'show'];
                $connection->send(json_encode($message));
            }
        } else if ($severTime % 28 == 26) {

            $timeCountdown = 1;
            foreach ($worker->connections as $connection) {
                $message = ['commend' => 'change stage', 'stage' => 'end'];
                $connection->send(json_encode($message));
            }
            resetGame();
        }
        foreach ($worker->connections as $connection) {
            $message = ['commend' => 'time countdown', 'time' => $timeCountdown];
            $connection->send(json_encode($message));
        }

        if ($timeCountdown != 0) {
            $timeCountdown--;
        }

        $severTime++;
    });
};

$ws_worker->onConnect = function ($connection) { };

// $ws_worker->onMessage = function ($connection, $data) {
//     global $ws_worker;
//     foreach ($ws_worker->connections as $conn) {
//         $conn->send(json_encode("user[{$connection->uid}] said: $data"));
//     }
// };

$ws_worker->onMessage = function ($connection, $data) {
    global $ws_worker, $playerdata, $totalBet;
    $temp = json_decode($data);
    if ($temp->commend == 'login') {
        // 判断当前客户端是否已经验证,即是否设置了uid
        if (!isset($connection->uid)) {
            // 没验证的话把第一个包当做uid（这里为了方便演示，没做真正的验证）
            $connection->uid = $temp->id;
            /* 保存uid到connection的映射，这样可以方便的通过uid查找connection，
        * 实现针对特定uid推送数据
        */
            $ws_worker->uidConnections[$connection->uid] = $connection;
            $playerdata[$connection->uid] = array(5000, 0, 0, 0);
            print_r($playerdata);

            $message = ['commend' => 'updateInfomation', 'name' => $connection->uid, 'money' => $playerdata[$connection->uid][0]];
            $connection->send(json_encode($message));
        }
    } else if ($temp->commend == 'bet') {
        $playerdata[$connection->uid][0] -= $temp->amount;
        $playerdata[$connection->uid][($temp->area) + 1] += $temp->amount;
        $totalBet[$temp->area] += $temp->amount;
        foreach ($ws_worker->connections as $connection) {
            $message = ['commend' => 'bet', 'area' => $temp->area, 'amount' => $temp->amount];
            $connection->send(json_encode($message));
        }
        print_r($playerdata);
    } else if ($temp->commend == 'requireInfomation') {
        $message = ['commend' => 'updateInfomation', 'name' => $connection->uid, 'money' => $playerdata[$connection->uid][0]];
        $connection->send(json_encode($message));
    }
};


function createCard()
{
    $rdmArray = [];
    for ($i = 0; $i < 2; $i++) {
        $rdm = 0;
        do {
            $exist = false;
            $rdm = rand(0, 51);

            if (in_array($rdm, $rdmArray)) {
                $exist = true;
            }
        } while ($exist);
        $rdmArray[$i] = $rdm;
    }
    return $rdmArray;
}

function cardResult()
{
    global $pokerCard;
    global $winner;
    if (($pokerCard[0] % 13) > ($pokerCard[1] % 13)) {
        $winner = 0;
    } else if (($pokerCard[0] % 13) < ($pokerCard[1] % 13)) {
        $winner = 2;
    } else {
        $winner = 1;
    }
}


function  dealWithMoney()
{
    global $winner;
    global $playerdata;
    if ($winner == 1) {
        foreach ($playerdata as $key => $value) {
            $playerdata[$key][0] += ($playerdata[$key][$winner + 1] * 9);
        }
    } else if ($winner == 0 || $winner == 2) {
        foreach ($playerdata as $key => $value) {
            $playerdata[$key][0] += ($playerdata[$key][$winner + 1] * 2);
        }
    }
}

function resetGame()
{
    global $pokerCard, $winner, $playerdata, $totalBet;
    $pokerCard = [-1, -1];
    $winner = -1;
    foreach ($playerdata as $key => $value) {
        $playerdata[$key][1] = 0;
        $playerdata[$key][2] = 0;
        $playerdata[$key][3] = 0;
    }
    $totalBet = array(0, 0, 0);
}


// 运行
Worker::runAll();
