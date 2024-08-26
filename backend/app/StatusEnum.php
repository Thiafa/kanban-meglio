<?php

namespace App;

enum StatusEnum: string
{
    case A_FAZER = "A fazer";
    case EM_ANDAMENTO = "Em andamento";
    case FEITO = "Feito";
}
