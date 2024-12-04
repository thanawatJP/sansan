from django.contrib import admin
from .models import Thread, Category
from django.utils.html import format_html

class ThreadAdmin(admin.ModelAdmin):
    list_display = ('author', 'content', 'created_at', 'display_image')  # แสดงฟิลด์ display_image ในรายการ

    def display_image(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" height="100" />', obj.image.url)
        return 'No Image'

    display_image.short_description = 'Image'

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)

admin.site.register(Thread, ThreadAdmin)
admin.site.register(Category, CategoryAdmin)
