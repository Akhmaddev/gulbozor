<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "navbar".
 *
 * @property int $id
 * @property string $nomi
 * @property string $manzili
 */
class Navbar extends \yii\db\ActiveRecord
{


    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'navbar';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['nomi', 'manzili'], 'required'],
            [['nomi'], 'string', 'max' => 70],
            [['manzili'], 'string', 'max' => 130],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'nomi' => 'Nomi',
            'manzili' => 'Manzili',
        ];
    }

    /**
     * {@inheritdoc}
     * @return NavbarQuery the active query used by this AR class.
     */
    public static function find()
    {
        return new NavbarQuery(get_called_class());
    }

}
