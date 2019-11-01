<?php
class player
{
    public $name;

    public $money;

    public $bets = [0, 0, 0];

    function __construct($n, $m)
    {
        $this->name = $n;
        $this->money = $m;
    }
}
