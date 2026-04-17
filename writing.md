---
layout: default
title: Writing
permalink: /writing/
---
<section class="writing">
  <h1>Writing</h1>
  <p>Posts, notes, and essays.</p>
  <ul class="post-list">
    {% for post in site.posts %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a><br>
        <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %-d, %Y" }}</time>
      </li>
    {% endfor %}
  </ul>
  <p class="feed-link"><a href="{{ '/feed.xml' | relative_url }}">RSS/Atom feed</a></p>
</section>
