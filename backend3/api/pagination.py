from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from collections import OrderedDict


class CustomPageNumberPagination(PageNumberPagination):
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        next_page = None
        previous_page = None
        if self.page.has_previous():
            previous_page = self.page.previous_page_number()
        if self.page.has_next():
            next_page = self.page.next_page_number()
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('page_size', self.get_page_size(self.request)),
            ('current', self.page.number),
            ('next', next_page),
            ('previous', previous_page),
            ('results', data)
        ]))
