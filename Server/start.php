<?php

use Workerman\Worker;
use Workerman\Lib\Timer;

require_once __DIR__  . './Autoloader.php';

// 创建一个Worker监听2346端口，使用websocket协议通讯
$ws_worker = new Worker("websocket://0.0.0.0:2346");

$severTime = 1;
// 启动4个进程对外提供服务
$ws_worker->count = 1;

$ws_worker->onWorkerStart = function ($worker) {

    Timer::add(1, function () use ($worker) {
        global $severTime;
        foreach ($worker->connections as $connection) {
            if ($severTime % 28 == 0) {
                $connection->send('waiting');
            } else if ($severTime % 28 == 3) {
                $connection->send('bet');
            } else if ($severTime % 28 == 14) {
                $connection->send('bet end');
            } else if ($severTime % 28 == 16) {
                $connection->send('show');
            } else if ($severTime % 28 == 25) {
                $connection->send('end');
            }
        }
        $severTime++;
    });
};





// 当收到客户端发来的数据后返回hello $data给客户端
$ws_worker->onMessage = 'on_mesage';


function on_mesage($connection, $data)
{
    // 向浏览器发送hello world
    $connection->send('hello world' . $data);
}

// 运行
Worker::runAll();
