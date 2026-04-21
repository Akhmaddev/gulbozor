<?php

use yii\helpers\Html;

/** @var yii\web\View $this */
/** @var common\models\Gullar $model */

$this->title = 'Create Gullar';
$this->params['breadcrumbs'][] = ['label' => 'Gullars', 'url' => ['index']];
$this->params['breadcrumbs'][] = $this->title;
?>
<div class="gullar-create">

    <h1><?= Html::encode($this->title) ?></h1>

    <?= $this->render('_form', [
        'model' => $model,
    ]) ?>

</div>
