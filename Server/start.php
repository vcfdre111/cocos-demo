<?php

use Workerman\Worker;
use Workerman\Lib\Timer;
use player as player;

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

$playerData = array();

$totalBet = array(0, 0, 0);

const roundTime = 28;

const newPlayeyData = array(5000, 0, 0, 0);

const stageStartTime = array('waiting' => 0, 'bet' => 4, 'betEnd' => 15, 'show' => 17, 'end' => 26);

$ws_worker->onWorkerStart = function ($worker) {

    Timer::add(1, function () use ($worker) {
        global $severTime, $timeCountdown, $pokerCard, $playerData;
        $message = [];
        if ($severTime % roundTime == stageStartTime['waiting']) {
            $timeCountdown = 3;
            foreach ($worker->connections as $connection) {
                $message = ['commend' => 'change stage', 'stage' => 'waiting'];
                $connection->send(json_encode($message));
            }
            print_r($playerData);
        } else if ($severTime % roundTime == stageStartTime['bet']) {
            $timeCountdown = 10;
            foreach ($worker->connections as $connection) {
                $message = ['commend' => 'change stage', 'stage' => 'bet'];
                $connection->send(json_encode($message));
            }
        } else if ($severTime % roundTime == stageStartTime['betEnd']) {
            $timeCountdown = 1;
            $pokerCard = createCard();
            foreach ($worker->connections as $connection) {
                $message = ['commend' => 'result card', 'card' => $pokerCard];
                $connection->send(json_encode($message));
                $message = ['commend' => 'change stage', 'stage' => 'bet end'];
                $connection->send(json_encode($message));
            }
            cardResult();
        } else if ($severTime % roundTime == stageStartTime['show']) {
            dealWithMoney();
            $timeCountdown = 8;
            foreach ($worker->connections as $connection) {
                $message = ['commend' => 'change stage', 'stage' => 'show'];
                $connection->send(json_encode($message));
            }
        } else if ($severTime % roundTime == stageStartTime['end']) {

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


$ws_worker->onMessage = function ($connection, $data) {
    global $ws_worker, $playerData, $totalBet;
    $temp = json_decode($data);
    if ($temp->commend == 'login') {
        print_r('login...');
        // 判断当前客户端是否已经验证,即是否设置了uid
        if (!isset($connection->uid)) {
            // 没验证的话把第一个包当做uid（这里为了方便演示，没做真正的验证）
            $connection->uid = $temp->id;
            /* 保存uid到connection的映射，这样可以方便的通过uid查找connection，
        * 实现针对特定uid推送数据
        */
            $ws_worker->uidConnections[$connection->uid] = $connection;
            $playerData[$connection->uid] = new player($connection->uid, 5000);
            print_r($playerData);

            $message = ['commend' => 'updateInfomation', 'name' => $connection->uid, 'money' => $playerData[$connection->uid]->money];
            $connection->send(json_encode($message));
        }
    } else if ($temp->commend == 'bet') {
        $playerData[$connection->uid]->money -= $temp->amount;
        $playerData[$connection->uid]->bets[($temp->area)] += $temp->amount;
        $totalBet[$temp->area] += $temp->amount;
        foreach ($ws_worker->connections as $connection2) {
            $message = ['commend' => 'bet', 'area' => $temp->area, 'amount' => $temp->amount];
            $connection2->send(json_encode($message));
            if ($connection2->uid != $connection->uid) {
                $message = ['commend' => 'addChip', 'area' => $temp->area, 'amount' => $temp->amount];
                $connection2->send(json_encode($message));
            }
        }

        print_r($playerData);
    } else if ($temp->commend == 'requireInfomation') {
        $message = ['commend' => 'updateInfomation', 'name' => $connection->uid, 'money' => $playerData[$connection->uid]->money];
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
    global $playerData;
    if ($winner == 1) {
        foreach ($playerData as $key => $value) {
            $playerData[$key]->money += ($playerData[$key]->bets[$winner] * 9);
        }
    } else if ($winner == 0 || $winner == 2) {
        foreach ($playerData as $key => $value) {
            $playerData[$key]->money += ($playerData[$key]->bets[$winner] * 2);
        }
    }
}

function resetGame()
{
    global $pokerCard, $winner, $playerData, $totalBet;
    $pokerCard = [-1, -1];
    $winner = -1;
    foreach ($playerData as $key => $value) {
        $playerData[$key]->bets = [0, 0, 0];
    }
    $totalBet = array(0, 0, 0);
}

function addGlobalChip($uid, $message)
{
    global $worker;
    foreach ($worker->uidConnections as $connection) {
        $connection->send($message);
    }
}




// 运行
Worker::runAll();
