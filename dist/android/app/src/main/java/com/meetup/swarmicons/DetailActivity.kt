package com.meetup.swarmicons

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.MenuItem
import kotlinx.android.synthetic.main.activity_detail.*


class DetailActivity : Activity() {
    val drawableName get() = intent.getStringExtra("drawable_name")!!
    val drawableId get() = intent.getIntExtra("drawable_id", 0)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        (intent.hasExtra("drawable_name") && intent.hasExtra("drawable_id")) || throw IllegalArgumentException()

        setContentView(R.layout.activity_detail)

        title = drawableName
        actionBar.apply {
            setDisplayHomeAsUpEnabled(true)
        }

        detailImage.apply {
            setImageResource(drawableId)
            transitionName = "icon_$drawableName"
        }

        window.sharedElementEnterTransition.duration = 200
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean =
        when (item.itemId) {
            android.R.id.home -> { finish(); true }
            else -> super.onOptionsItemSelected(item)
        }

    companion object {
        fun intent(context : Context, info: DrawableInfo) =
            Intent(context, DetailActivity::class.java).apply {
                putExtra("drawable_name", info.first)
                putExtra("drawable_id", info.second)
            }
    }
}