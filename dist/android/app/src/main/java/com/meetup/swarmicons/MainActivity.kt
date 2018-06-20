package com.meetup.swarmicons

import android.app.Activity
import android.app.ActivityOptions
import android.graphics.Color
import android.os.Bundle
import android.support.annotation.ColorInt
import android.support.v4.content.ContextCompat
import android.support.v7.widget.GridLayoutManager
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : Activity() {
    @get:ColorInt val foundationRed by lazy(LazyThreadSafetyMode.NONE) {
        ContextCompat.getColor(this, R.color.foundation_red)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val adapter = IconAdapter(this)

        recyclerView.layoutManager = GridLayoutManager(this, preferredColumnCount())
        recyclerView.adapter = adapter
        redCheckBox.setOnCheckedChangeListener { _, b ->
            adapter.color = if (b) foundationRed else Color.BLACK
        }
        adapter.itemClickListener = { info, view, transitionName ->
            val opts = ActivityOptions.makeSceneTransitionAnimation(this, view, transitionName)
            startActivity(DetailActivity.intent(this, info), opts.toBundle())
        }
    }

    private fun preferredColumnCount() : Int =
        resources.run { displayMetrics.widthPixels / getDimensionPixelSize(R.dimen.min_column_width) }
}

