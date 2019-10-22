<?php

use Workerman\Worker;
use Workerman\Lib\Timer;

require_once __DIR__  . './Autoloader.php';

// 创建一个Worker监听2346端口，使用websocket协议通讯
$ws_worker = new Worker("websocket://0.0.0.0:2346");

$severTime = 1;

$timeCountdown = 0;

$ws_worker->count = 1;

$global_uid = 0;

$ws_worker->onWorkerStart = function ($worker) {

    Timer::add(1, function () use ($worker) {
        global $severTime;
        global $timeCountdown;
        $message = [];
        foreach ($worker->connections as $connection) {
            if ($severTime % 28 == 0) {
                $message = ['commend' => 'change stage', 'stage' => 'waiting'];
                $timeCountdown = 3;
                $connection->send(json_encode($message));
            } else if ($severTime % 28 == 4) {
                $message = ['commend' => 'change stage', 'stage' => 'bet'];
                $timeCountdown = 10;
                $connection->send(json_encode($message));
            } else if ($severTime % 28 == 15) {
                $message = ['commend' => 'change stage', 'stage' => 'bet end'];
                $timeCountdown = 1;
                $connection->send(json_encode($message));
            } else if ($severTime % 28 == 17) {
                $message = ['commend' => 'change stage', 'stage' => 'show'];
                $timeCountdown = 8;
                $connection->send(json_encode($message));
            } else if ($severTime % 28 == 26) {
                $message = ['commend' => 'change stage', 'stage' => 'end'];
                $timeCountdown = 1;
                $connection->send(json_encode($message));
            }
            $message = ['commend' => 'time countdown', 'time' => $timeCountdown];
            $connection->send(json_encode($message));
        }
        if ($timeCountdown != 0) {
            $timeCountdown--;
        }

        $severTime++;
    });
};

$ws_worker->onConnect = function ($connection) {
    global $ws_worker, $global_uid;
    // 为这个连接分配一个uid
    $connection->uid = $global_uid;
    $connection->send(json_encode("your UID" . $connection->uid));
    $global_uid++;
};

$ws_worker->onMessage = function ($connection, $data) {
    global $ws_worker;
    foreach ($ws_worker->connections as $conn) {
        $conn->send(json_encode("user[{$connection->uid}] said: $data"));
    }
};




// 运行
Worker::runAll();
