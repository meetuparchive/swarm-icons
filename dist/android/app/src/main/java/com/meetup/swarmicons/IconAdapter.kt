package com.meetup.swarmicons

import android.support.v7.widget.RecyclerView
import android.content.Context
import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import kotlinx.android.synthetic.main.item_icon.view.*
import java.text.Collator
import kotlin.properties.Delegates

typealias DrawableInfo = Pair<String, Int>
typealias ItemClickListener = (DrawableInfo, ImageView, String) -> Unit

class IconAdapter(context: Context) : RecyclerView.Adapter<IconAdapter.IconHolder>() {
    private val drawables : List<DrawableInfo> = R.drawable::class.java.declaredFields
            .filter { field -> field.name.run { startsWith("ic_") && !startsWith("ic_launcher_") } }
            .map { field -> field.name!! to field.getInt(null) }
            .sortedWith(compareBy(Collator.getInstance()) { it.first })
    private val inflater : LayoutInflater = LayoutInflater.from(context)
    var color by Delegates.observable(Color.BLACK, { _, _, _ -> notifyDataSetChanged() })
    var itemClickListener : ItemClickListener? = null

    init {
        setHasStableIds(true)
    }

    override fun onCreateViewHolder(parent: ViewGroup?, viewType: Int) =
        IconHolder(inflater.inflate(R.layout.item_icon, parent, false))

    override fun onBindViewHolder(holder: IconHolder, position: Int) {
        holder.bind(drawables[position], color)
    }

    override fun getItemId(position: Int): Long = drawables[position].second.toLong()

    override fun getItemCount(): Int = drawables.size

    inner class IconHolder(v: View) : RecyclerView.ViewHolder(v) {
        fun bind(p: DrawableInfo, color: Int) { p.let { (name, id) ->
            val view = itemView
            val drawable = view.context.getDrawable(id)
            val layoutParams = view.iconImageView.layoutParams
            layoutParams.height = drawable.intrinsicHeight
            layoutParams.width = drawable.intrinsicWidth
            drawable.setTint(color)
            view.iconImageView.layoutParams = layoutParams
            view.iconImageView.setImageDrawable(drawable)
            view.iconName.text = name
            val transitionName = "icon_$name"
            view.iconImageView.transitionName = transitionName
            view.setOnClickListener { _ -> itemClickListener?.invoke(p, view.iconImageView, transitionName) }
        } }
    }
}