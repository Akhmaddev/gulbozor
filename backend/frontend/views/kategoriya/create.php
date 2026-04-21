<?php

use yii\helpers\Html;

/** @var yii\web\View $this */
/** @var common\models\Kategoriya $model */

$this->title = 'Create Kategoriya';
$this->params['breadcrumbs'][] = ['label' => 'Kategoriyas', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="kategoriya-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
