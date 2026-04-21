<?php

namespace common\models;

/**
 * This is the ActiveQuery class for [[Gullar]].
 *
 * @see Gullar
 */
class GullarQuery extends \yii\db\ActiveQuery
{
    /*public function active()
    {
        return $this->andWhere('[[status]]=1');
    }*/

    /**
     * {@inheritdoc}
     * @return Gullar[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * {@inheritdoc}
     * @return Gullar|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
