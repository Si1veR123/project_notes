from django.shortcuts import render, redirect


def main(r):
    return render(r, "main.html")
