"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronsDown } from "./components/ChevronsDown";
import { Download } from "./components/Download";
import { Grip } from "./components/Grip";
import { WandSparkles } from "./components/WandSparkles";
import { Link2 } from "./components/Link2";
import { Undo } from "./components/Undo";
import { Flame } from "./components/Flame";
import { Discord } from "./components/Discord";
import { Github } from "./components/Github";
import { LeftArrow } from "./components/LeftArrow"
import { BadgeAlert } from "./components/BadgeAlert"
import { RightArrow } from "./components/RightArrow"
import { p } from "framer-motion/client";

interface Release {
  id: number;
  name: string;
  tag_name: string;
  html_url: string;
  published_at: string;
  assets: {
    name: string;
    browser_download_url: string;
  }[];
}

interface Release {
  tag_name: string;
  published_at: string;
  body: string;
  assets: { browser_download_url: string; name: string }[];
}

export default function Home() {
  const [showRotateMessage, setShowRotateMessage] = useState(false);
  const [version, setVersion] = useState<string | null>(null);
  const [buildDate, setBuildDate] = useState<string | null>(null);
  const [releases, setReleases] = useState<Release[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const releasesPerPage = 6;
  const [release, setRelease] = useState<Release | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch latest release from IzTendo's repo
  useEffect(() => {
    async function fetchLatestRelease() {
      try {
        const res = await fetch(
          "https://api.github.com/repos/IzTendo/NSW-FortnitePerformanceMod/releases/latest"
        );
        if (!res.ok) throw new Error("Failed to fetch release");
        const data: Release = await res.json();
        setRelease(data);
      } catch (err) {
        setError((err as Error).message);
      }
    }
    fetchLatestRelease();
  }, []);

  // Fetch releases from YoshiCrystal9's repo
  useEffect(() => {
    async function fetchReleases() {
      try {
        const response = await fetch(
          "https://api.github.com/repos/YoshiCrystal9/FortPatcher-NX/releases"
        );
        const data: Release[] = await response.json();
        const filtered = data.filter((r) =>
          r.assets.some((asset) => asset.name === "all_patches.zip")
        );
        setReleases(filtered);
      } catch {
        // Handle error if needed
      }
    }
    fetchReleases();
  }, []);

  // Fetch Fortnite version
  useEffect(() => {
    async function fetchFortniteVersion() {
      try {
        const response = await fetch(
          "https://api.allorigins.win/get?url=" +
          encodeURIComponent(
            "https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/version"
          )
        );
        const data = await response.json();
        const fortniteData = JSON.parse(data.contents);

        const version = fortniteData.version;
        const buildDate = new Date(fortniteData.buildDate).toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        setVersion(version);
        setBuildDate(buildDate);
      } catch (error) {
        console.error("Error fetching Fortnite version:", error);
        setVersion("Error Reload Page");
        setBuildDate("Error");
      }
    }
    fetchFortniteVersion();
  }, []);

  // Check orientation on resize/orientationchange
  useEffect(() => {
    function checkOrientation() {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const isPortrait = window.matchMedia("(orientation: portrait)").matches;
      setShowRotateMessage(isMobile && isPortrait);
    }

    checkOrientation();

    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", checkOrientation);

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  // Utility function for time ago
  function timeSince(dateString: string) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) {
        return count + " " + interval.label + (count > 1 ? "s" : "") + " ago";
      }
    }
    return "just now";
  }

  if (error) return <div>Error loading release info: {error}</div>;

  if (!release) return <div className="fixed inset-0 text-white z-[9999] flex flex-col justify-center items-center text-center p-5 text-lg font-bold bg-gray-500/30 bg-clip-padding backdrop-filter  backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 bg-[url('data:image/svg+xml;base64,CiAgICAgIDxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpzdmdqcz0iaHR0cDovL3N2Z2pzLmRldi9zdmdqcyIgdmlld0JveD0iMCAwIDcwMCA3MDAiIHdpZHRoPSI3MDAiIGhlaWdodD0iNzAwIiBvcGFjaXR5PSIxIj4KICAgICAgICA8ZGVmcz4KICAgICAgICAgIDxmaWx0ZXIgaWQ9Im5ubm9pc2UtZmlsdGVyIiB4PSItMjAlIiB5PSItMjAlIiB3aWR0aD0iMTQwJSIgaGVpZ2h0PSIxNDAlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHByaW1pdGl2ZVVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJsaW5lYXJSR0IiPgogICAgICAgICAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC4xOCIgbnVtT2N0YXZlcz0iNCIgc2VlZD0iMTUiIHN0aXRjaFRpbGVzPSJzdGl0Y2giIHg9IjAlIiB5PSIwJSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgcmVzdWx0PSJ0dXJidWxlbmNlIj48L2ZlVHVyYnVsZW5jZT4KICAgICAgICAgICAgPGZlU3BlY3VsYXJMaWdodGluZyBzdXJmYWNlU2NhbGU9IjQwIiBzcGVjdWxhckNvbnN0YW50PSIwLjciIHNwZWN1bGFyRXhwb25lbnQ9IjIwIiBsaWdodGluZy1jb2xvcj0iIzc5NTdBOCIgeD0iMCUiIHk9IjAlIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBpbj0idHVyYnVsZW5jZSIgcmVzdWx0PSJzcGVjdWxhckxpZ2h0aW5nIj4KICAgICAgICAgICAgICA8ZmVEaXN0YW50TGlnaHQgYXppbXV0aD0iMyIgZWxldmF0aW9uPSIxMDAiPjwvZmVEaXN0YW50TGlnaHQ+CiAgICAgICAgICAgIDwvZmVTcGVjdWxhckxpZ2h0aW5nPgogICAgICAgICAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIiB4PSIwJSIgeT0iMCUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGluPSJzcGVjdWxhckxpZ2h0aW5nIiByZXN1bHQ9ImNvbG9ybWF0cml4Ij48L2ZlQ29sb3JNYXRyaXg+CiAgICAgICAgICA8L2ZpbHRlcj4KICAgICAgICA8L2RlZnM+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjcwMCIgaGVpZ2h0PSI3MDAiIGZpbGw9InRyYW5zcGFyZW50Ij48L3JlY3Q+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjcwMCIgaGVpZ2h0PSI3MDAiIGZpbGw9IiM3OTU3YTgiIGZpbHRlcj0idXJsKCNubm5vaXNlLWZpbHRlcikiPjwvcmVjdD4KICAgICAgPC9zdmc+CiAgICA=')] bg-blend-overlay" >Loading in all info. This wont take long!</div>;

  const zipAsset = release.assets.find((asset) =>
    asset.name.toLowerCase().endsWith(".zip")
  );

  const start = (currentPage - 1) * releasesPerPage;
  const end = start + releasesPerPage;
  const paginatedReleases = releases.slice(start, end);
  const latestRelease = releases[0];

  return (
    <>
      {showRotateMessage && (
        <div className="fixed inset-0 text-white z-[9999] flex flex-col justify-center items-center text-center p-5 text-lg font-bold bg-gray-500/30 bg-clip-padding backdrop-filter  backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 bg-[url('data:image/svg+xml;base64,CiAgICAgIDxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpzdmdqcz0iaHR0cDovL3N2Z2pzLmRldi9zdmdqcyIgdmlld0JveD0iMCAwIDcwMCA3MDAiIHdpZHRoPSI3MDAiIGhlaWdodD0iNzAwIiBvcGFjaXR5PSIxIj4KICAgICAgICA8ZGVmcz4KICAgICAgICAgIDxmaWx0ZXIgaWQ9Im5ubm9pc2UtZmlsdGVyIiB4PSItMjAlIiB5PSItMjAlIiB3aWR0aD0iMTQwJSIgaGVpZ2h0PSIxNDAlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHByaW1pdGl2ZVVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJsaW5lYXJSR0IiPgogICAgICAgICAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC4xOCIgbnVtT2N0YXZlcz0iNCIgc2VlZD0iMTUiIHN0aXRjaFRpbGVzPSJzdGl0Y2giIHg9IjAlIiB5PSIwJSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgcmVzdWx0PSJ0dXJidWxlbmNlIj48L2ZlVHVyYnVsZW5jZT4KICAgICAgICAgICAgPGZlU3BlY3VsYXJMaWdodGluZyBzdXJmYWNlU2NhbGU9IjQwIiBzcGVjdWxhckNvbnN0YW50PSIwLjciIHNwZWN1bGFyRXhwb25lbnQ9IjIwIiBsaWdodGluZy1jb2xvcj0iIzc5NTdBOCIgeD0iMCUiIHk9IjAlIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBpbj0idHVyYnVsZW5jZSIgcmVzdWx0PSJzcGVjdWxhckxpZ2h0aW5nIj4KICAgICAgICAgICAgICA8ZmVEaXN0YW50TGlnaHQgYXppbXV0aD0iMyIgZWxldmF0aW9uPSIxMDAiPjwvZmVEaXN0YW50TGlnaHQ+CiAgICAgICAgICAgIDwvZmVTcGVjdWxhckxpZ2h0aW5nPgogICAgICAgICAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIiB4PSIwJSIgeT0iMCUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGluPSJzcGVjdWxhckxpZ2h0aW5nIiByZXN1bHQ9ImNvbG9ybWF0cml4Ij48L2ZlQ29sb3JNYXRyaXg+CiAgICAgICAgICA8L2ZpbHRlcj4KICAgICAgICA8L2RlZnM+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjcwMCIgaGVpZ2h0PSI3MDAiIGZpbGw9InRyYW5zcGFyZW50Ij48L3JlY3Q+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjcwMCIgaGVpZ2h0PSI3MDAiIGZpbGw9IiM3OTU3YTgiIGZpbHRlcj0idXJsKCNubm5vaXNlLWZpbHRlcikiPjwvcmVjdD4KICAgICAgPC9zdmc+CiAgICA=')] bg-blend-overlay">
          Please rotate your phone to landscape mode for the best experience.
        </div>
      )}

      <div
        style={{
          filter: showRotateMessage ? "blur(5px)" : "none",
          pointerEvents: showRotateMessage ? "none" : "auto",
        }}
      >
        <div className="navbar p-4 m-auto lg:w-4/5 w-5/6 mt-2 bg-gray-900/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md shadow-md rounded-lg">
          <div className="navbar-start space-x-2">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="229pt"
              height="504pt"
              viewBox="0 0 229 504"
              preserveAspectRatio="xMidYMid meet"
              className="w-4 h-auto fill-current"
            >
              <g transform="translate(0,504) scale(0.1,-0.1)">
                <path d="M60 2536 c0 -1311 2 -2391 6 -2399 6 -17 5 -17 690 113 259 50 474 90 477 90 4 0 8 368 9 818 l3 817 371 3 371 2 7 278 c3 152 9 411 12 574 l7 298 -384 2 -384 3 0 305 0 305 441 3 441 2 6 53 c4 28 22 234 42 457 19 223 40 446 45 497 6 51 10 108 10 128 l0 35 -1085 0 -1085 0 0 -2384z" />
              </g>
            </svg>

            <a className=" text-xl font-semibold bg-linear-to-r from-base-content from-40% to-primary bg-clip-text text-transparent">
              <span className="font-bold">The</span> Fortpatcher
            </a>
          </div>
          <div className="navbar-center"></div>
          <div className="navbar-end">
            <button
              className="btn btn-ghost rounded-md"
              onClick={() => {
                const modal = document.getElementById("my_modal_1");
                if (modal) {
                  (modal as HTMLDialogElement).showModal();
                }
              }}

            >
              <Grip className="stroke-current" />
            </button>
            <dialog id="my_modal_1" className="modal">
              <div className="modal-box w-11/12 max-w-5xl bg-gray-500/30 bg-clip-padding backdrop-filter  backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 bg-[url('data:image/svg+xml;base64,CiAgICAgIDxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpzdmdqcz0iaHR0cDovL3N2Z2pzLmRldi9zdmdqcyIgdmlld0JveD0iMCAwIDcwMCA3MDAiIHdpZHRoPSI3MDAiIGhlaWdodD0iNzAwIiBvcGFjaXR5PSIxIj4KICAgICAgICA8ZGVmcz4KICAgICAgICAgIDxmaWx0ZXIgaWQ9Im5ubm9pc2UtZmlsdGVyIiB4PSItMjAlIiB5PSItMjAlIiB3aWR0aD0iMTQwJSIgaGVpZ2h0PSIxNDAlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIHByaW1pdGl2ZVVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJsaW5lYXJSR0IiPgogICAgICAgICAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC4xOCIgbnVtT2N0YXZlcz0iNCIgc2VlZD0iMTUiIHN0aXRjaFRpbGVzPSJzdGl0Y2giIHg9IjAlIiB5PSIwJSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgcmVzdWx0PSJ0dXJidWxlbmNlIj48L2ZlVHVyYnVsZW5jZT4KICAgICAgICAgICAgPGZlU3BlY3VsYXJMaWdodGluZyBzdXJmYWNlU2NhbGU9IjQwIiBzcGVjdWxhckNvbnN0YW50PSIwLjciIHNwZWN1bGFyRXhwb25lbnQ9IjIwIiBsaWdodGluZy1jb2xvcj0iIzc5NTdBOCIgeD0iMCUiIHk9IjAlIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBpbj0idHVyYnVsZW5jZSIgcmVzdWx0PSJzcGVjdWxhckxpZ2h0aW5nIj4KICAgICAgICAgICAgICA8ZmVEaXN0YW50TGlnaHQgYXppbXV0aD0iMyIgZWxldmF0aW9uPSIxMDAiPjwvZmVEaXN0YW50TGlnaHQ+CiAgICAgICAgICAgIDwvZmVTcGVjdWxhckxpZ2h0aW5nPgogICAgICAgICAgICA8ZmVDb2xvck1hdHJpeCB0eXBlPSJzYXR1cmF0ZSIgdmFsdWVzPSIwIiB4PSIwJSIgeT0iMCUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGluPSJzcGVjdWxhckxpZ2h0aW5nIiByZXN1bHQ9ImNvbG9ybWF0cml4Ij48L2ZlQ29sb3JNYXRyaXg+CiAgICAgICAgICA8L2ZpbHRlcj4KICAgICAgICA8L2RlZnM+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjcwMCIgaGVpZ2h0PSI3MDAiIGZpbGw9InRyYW5zcGFyZW50Ij48L3JlY3Q+CiAgICAgICAgPHJlY3Qgd2lkdGg9IjcwMCIgaGVpZ2h0PSI3MDAiIGZpbGw9IiM3OTU3YTgiIGZpbHRlcj0idXJsKCNubm5vaXNlLWZpbHRlcikiPjwvcmVjdD4KICAgICAgPC9zdmc+CiAgICA=')] bg-blend-overlay">
                <div className="divider my-0 text-lg px-2">Menu</div>

                <div className="grid grid-cols-4 grid-rows-5 gap-4">
                  <div className="p-4 bg-gray-900/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md shadow-sm rounded-lg col-span-2 row-span-3 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2">
                      <WandSparkles className="w-5" />
                      Toggle Theme
                    </div>

                    <label className="swap swap-rotate">
                      {/* Hidden checkbox to toggle themes */}
                      <input
                        type="checkbox"
                        className="theme-controller"
                        value="nord"
                      />

                      {/* Sun icon */}
                      <svg
                        className="swap-off h-10 w-10 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                      </svg>

                      {/* Moon icon */}
                      <svg
                        className="swap-on h-10 w-10 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                      </svg>
                    </label>
                  </div>

                  <div className="p-4 bg-gray-900/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md shadow-sm rounded-lg col-span-2 row-span-5 col-start-3 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Link2 className="w-5" />
                      Hyper Links
                    </div>
                    <div className="join join-vertical">
                      <a className="btn btn-primary join-item" href="#AboutPage">About Page</a>
                      <a className="btn btn-primary join-item" href="#FortPatcherReleases">FortPatcher Releases</a>
                      <a className="btn btn-primary join-item" href="#FortPatcherUpdater">FortPatcher Updater</a>
                      <a className="btn btn-primary join-item" href="#FPSMod">IzTendo Mod</a>
                      <a className="btn btn-primary join-item" href="#FAQ">FAQ's</a>
                    </div>


                  </div>
                  <div className="p-4 bg-gray-900/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md shadow-sm rounded-lg col-span-2 row-span-2 col-start-1 row-start-4 flex flex-col items-center justify-center">
                    Goofy ahh
                  </div>
                </div>

                <div className="modal-action">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-ghost rounded-md">
                      <Undo className="w-5 stroke-current" />
                    </button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
        </div>

        <div
          style={{ zIndex: 1 }}
          id="AboutPage"
          className="mt-4 p-4 m-auto lg:w-2/3 w-5/6 bg-gray-900/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md shadow-md flex flex-col items-center"
        >
          <h1 className="text-3xl font-bold">About the FortPatcher_NX</h1>
          <div className="divider">
            <Flame className="w-10 stroke-current" />
          </div>
          <p className="text-center pb-6">
            Play the new versions of Fortnite even when banned on the Nintendo Switch!<br />(Note: Owner is not responsible for any console bans from Epic Games from these patches. But there are currently never has been a ban from using the patches or mods!)
          </p>

          <div className="join join-vertical lg:join-horizontal">
            <a
              href="https://discord.gg/ukXSHFprKc"
              target="blank_"
              className="btn rounded-md join-item"
            >
              <Discord /> Discord
            </a>
            <a
              href="https://github.com/YoshiCrystal9/FortPatcher-NX"
              target="blank_"
              className="btn rounded-md join-item"
            >
              <Github /> Github
            </a>
          </div>

          <div
            className="stats bg-base-100 transform my-2 shadow-lg"
            style={{
              backgroundImage: `
      radial-gradient(at 43% 85%, var(--color-primary) 0%, transparent 60%),
      radial-gradient(at 41% 87%, var(--color-primary-content) 0%, transparent 50%),
      radial-gradient(at 19% 31%, var(--color-secondary) 0%, transparent 40%),
      radial-gradient(at 11% 78%, var(--color-secondary-content) 0%, transparent 30%)
    `,
            }}
          >
            <div className="stat">
              <div className="stat-title font-medium">
                Current Switch Version Fortnite
              </div>
              <div className="stat-value" id="version">
                {version ? (
                  version
                ) : (
                  <span className="loading loading-spinner"></span>
                )}
              </div>
              <div className="stat-actions">
                <button
                  className="btn btn-xs rounded-md btn-success"
                  id="builtdate"
                >
                  {buildDate ? (
                    buildDate
                  ) : (
                    <span className="loading loading-spinner p-2"></span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{ zIndex: 1 }}
          id="FortPatcherReleases"
          className="mt-4 p-4 m-auto lg:w-2/3 w-5/6 bg-gray-900/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md shadow-md flex flex-col items-center"
        >

          <h1 className="text-3xl font-bold">FortPatcher-NX Releases</h1>
          <div className="divider">
            <Flame className="w-10 stroke-current" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto rounded-lg border-collapse border" >
              <thead>
                <tr>
                  <th className="border border-primary px-4 py-2">Version</th>
                  <th className="border border-primary px-4 py-2">Download</th>
                  <th className="border border-primary px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody className="overflow-hidden text-ellipsis">
                {paginatedReleases.map((release) => {
                  const allPatches = release.assets.find(
                    (asset) => asset.name === "all_patches.zip"
                  );
                  const isCurrent = release.id === latestRelease?.id;
                  return (
                    <tr key={release.id} className="hover:bg-base-200/20">
                      <td className="border border-primary px-4 py-2">
                        <a
                          href={release.html_url}
                          target="_blank"
                          className="text-secondary hover:underline font-medium"
                        >
                          {release.name || release.tag_name}
                        </a>
                        {isCurrent && (
                          <div className="badge badge-primary ml-2">
                            Current
                          </div>
                        )}
                      </td>
                      <td className="border border-primary px-4 py-2">
                        <a
                          href={allPatches?.browser_download_url}
                          target="_blank"
                          className="text-info hover:underline font-medium"
                        >
                          all_patches.zip
                        </a>
                      </td>
                      <td className="border border-primary px-4 py-2">
                        {timeSince(release.published_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm italic">Patched were made by: Anto, Rangelito, and YoshiCrystal.</p>
          </div>

          <div className="join join-horizontal mt-4">
            <button className="btn btn-soft btn-primary join-item" onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}><LeftArrow /></button>
            <button className="btn join-item btn-disabled" role="button" aria-disabled="true"><span className="text-lg font-semibold">Page {currentPage}</span></button>
            <button className="btn btn-soft btn-primary join-item" onClick={() => setCurrentPage((prev) => prev + 1)} disabled={end >= releases.length}><RightArrow /></button>
          </div>

        </div>

        <div
          style={{ zIndex: 1 }}
          id="FortPatcherUpdater"
          className="mt-4 p-4 m-auto lg:w-2/3 w-5/6 bg-gray-900/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md shadow-md flex flex-col items-center"
        >

          <div className="card bg-base-100 image-full w-full shadow-sm">
            <figure>
              <img
                src="/FortPatcherUpdaterShowCase.jpg"
                alt="Shoes" />
            </figure>
            <div className="hero-content text-center">
              <div className="max-w-md">
                <h1 className="text-3xl font-bold">Want a quicker way to download the latest patches?</h1>
                <p className="py-6">
                  This simple homebrew app I've created makes it so that there isn't any need for a PC to download the patches!
                </p>
                <div className="join join-vertical lg:join-horizontal">
                  <a
                    href="https://github.com/iminthebibleson/fortpatcher_updater/releases/download/1.2.0/Fortpatcher_1_2_0.nro"
                    target="blank_"
                    className="btn rounded-md join-item"
                  >
                    <Download /> Download
                  </a>
                  <a
                    href="https://github.com/iminthebibleson/fortpatcher_updater"
                    target="blank_"
                    className="btn rounded-md join-item"
                  >
                    <Github /> Github
                  </a>
                </div>

              </div>
            </div>
          </div>


        </div>

        <div
          style={{ zIndex: 1 }}
          id="FPSMod"
          className="mt-4 p-4 m-auto lg:w-2/3 w-5/6 bg-gray-900/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md shadow-md flex flex-col items-center"
        >


          <div className="mockup-browser border border-base-300 w-full">
            <div className="mockup-browser-toolbar">
              <a href="https://github.com/IzTendo/NSW-FortnitePerformanceMod" target="blank_" className="input w-fit">https://github.com/IzTendo/NSW-FortnitePerformanceMod</a>
            </div>
            <div className="flex flex-col items-center h-80 w-full"><div>IzTendo's Proformance Mod | <span className="font-light ">V. {release.tag_name}</span></div>

              <h1 className="text-2xl font-bold mb-2 text-left">Latest Release</h1>
              <div><strong>Published:</strong> {timeSince(release.published_at)}</div>

              <div className="card bg-base-100 image-full w-96 shadow-sm">
                <figure>
                  <img
                    src="/ShowCase.webp"
                    alt="Shoes" />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">Release Notes</h2>
                  <p>{release.body || "No notes available."}</p>
                  <div className="card-actions justify-end">
                    {zipAsset && (
                      <a
                        href={zipAsset.browser_download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost rounded-md btn-primary"
                      >
                        Download Latest
                      </a>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>


        <div
          style={{ zIndex: 1 }}
          id="FAQ"
          className="mt-4 p-4 m-auto lg:w-2/3 w-5/6 bg-gray-900/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md shadow-md flex flex-col items-center"
        >

          <h2 className="text-2xl text-center font-semibold mb-4">FAQ</h2>
          <div className="collapse collapse-arrow bg-base-100 border my-1 border-base-300 text-ellipsis">
            <input type="checkbox" name="my-accordion-2" />
            <div className="collapse-title font-semibold flex"><BadgeAlert /> | How to Install it?</div>
            <div className="collapse-content text-sm">
              <div>
                <div>1. First, have a modded switch (obviously).</div>
                <div>&nbsp;</div>
                <div>2. Secondly, Download and install the base Fortnite NSP
                  <a href="./src/Base.nsp" download="Base.nsp" target="_blank"
                    className="link link-primary">Base.nsp</a>.
                </div>
                <div>&nbsp;</div>
                <div>3. While you're still on the Tinfoil app, you will need to turn on its fake Nintendo account in
                  Options &gt; Fake Link Nintendo Online Account, then it will be rebooted. (You would only need
                  to do this if you dont have an Account already Linked.)
                </div>
                <div>&nbsp;</div>
                <div>4. After that, you could now download the Fortnite launcher via this link. <a
                  href="https://github.com/YoshiCrystal9/FortniteSwitchLatestLauncher" target="_blank"
                  className="link link-primary">(Download here)</a>.</div>
                <div>&nbsp;</div>
                <div>5. Up next, you can download the most recent FortPatcher patches at the top. ^</div>
                <div>&nbsp;</div>
                <div>6. Last thing to download: go to the Discord server to the #latest-build chat and download the
                  most recent update. nsp code and download it via tinfoil.
                </div>
                <div>&nbsp;</div>
                <div>7. Then you're all done! (kinda) Now you just have to open up the homebrew menu in applet mode
                  (album) and select the "Fortnite latest launcher," then follow the instructions there, and then
                  just simply press B after to launch in Fortnite.
                </div>
              </div>
            </div>
          </div>
          <div className="collapse collapse-arrow bg-base-100 border my-1 border-base-300 text-ellipsis">
            <input type="checkbox" name="my-accordion-2" />
            <div className="collapse-title font-semibold flex"><BadgeAlert /> | How can i create my own Patches?</div>
            <div className="collapse-content text-sm">
              Here is an Tutorial on how to create your own custom patch! <br /> <a className="link link-primary"
                href="https://gist.github.com/AntogamerYT/c96da191cf293c054c419aba96edbc31">https://gist.github.com/AntogamerYT/c96da191cf293c054c419aba96edbc31</a>
              <a>created by Anto</a>
            </div>
          </div>
          <div className="collapse collapse-arrow bg-base-100 border my-1 border-base-300 text-ellipsis">
            <input type="checkbox" name="my-accordion-2" />
            <div className="collapse-title font-semibold flex"><BadgeAlert /> | Where to find Update files for Fortite?</div>
            <div className="collapse-content text-sm">
              Your could find all updates in this google drive link! <a
                href="https://drive.google.com/drive/folders/12NBp7-44cxLguccbsowm4emGhy3zq0Qd" target="_blank"
                className="link link-primary">Link Here</a>
            </div>
          </div>
          <div className="collapse collapse-arrow bg-base-100 border my-1 border-base-300 text-ellipsis">
            <input type="checkbox" name="my-accordion-2" />
            <div className="collapse-title font-semibold flex"><BadgeAlert /> | Are there mods for Fortnite?</div>
            <div className="collapse-content text-sm">
              Yes! There are mods for fortnite but mainly for proformance. You can find them in there discord server!
              <a href="https://discord.com/channels/939722946853875722/1121480338699452486" target="_blank"
                className="link link-primary">Link to Mods Channel</a>
            </div>
          </div>
          <div className="collapse collapse-arrow bg-base-100 border my-1 border-base-300 text-ellipsis">
            <input type="checkbox" name="my-accordion-2" />
            <div className="collapse-title font-semibold flex"><BadgeAlert /> | What are the Supported Versions?</div>
            <div className="collapse-content text-sm">
              If the verison your looking
              for is not here then that means you would have a build your own!
              <table className="w-full table-auto rounded border-collapse border">
                <thead>
                  <tr>
                    <th className="border border-primary px-4 py-2 ">Chapters</th>
                    <th className="border border-primary px-4 py-2 ">Supported Versions</th>
                  </tr>
                </thead>
                <tbody className="overflow-hidden text-ellipsis">
                  <tr className="hover:bg-base-200">
                    <td className="border border-primary text-center py-2">Chapter 1</td>
                    <td className="border border-primary px-4 py-2">4.4.2, 4.5, 5.10, 5.10.1, 5.10.2, 5.30.2, 5.40,
                      5.41, 6.10, 6.21, 6.30, 6.31, 7.10, 7.20.1, 7.40, 8.30.1, 8.50, 8.51, 9.00, 9.10, 9.20,
                      9.30.1, 9.41, 10.10, 10.30, 10.31, 10.40
                    </td>
                  </tr>
                  <tr className="hover:bg-base-200">
                    <td className="border border-primary text-center py-2">Chapter 2</td>
                    <td className="border border-primary px-4 py-2">11.0.1, 12.10, 12.61, 13.40, 14.30</td>
                  </tr>
                  <tr className="hover:bg-base-200">
                    <td className="border border-primary text-center py-2">Chapter 3</td>
                    <td className="border border-primary px-4 py-2">19.10, 22.30</td>
                  </tr>
                  <tr className="hover:bg-base-200">
                    <td className="border border-primary text-center py-2">Chapter 4</td>
                    <td className="border border-primary px-4 py-2">25.10, 25.11, 25.20, 27.00, 27.11</td>
                  </tr>
                  <tr className="hover:bg-base-200">
                    <td className="border border-primary text-center py-2">Chapter 5</td>
                    <td className="border border-primary px-4 py-2">28.20.1, 28.30, 29.00, 29.00.1, 29.01, 29.10,
                      29.20, 29.30, 29.40, 29.40.1, 30.00.0, 30.00.1, 30.10.0, 30.20.0, 30.20.1, 31.00.0,
                      31.10.0, 31.20.0, <span className="font-bold">every new version from now on</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <footer className="footer sm:footer-horizontal footer-center mt-4 p-4 m-auto lg:w-4/5 w-5/6 mt-2 bg-gray-900/30 rounded-md bg-clip-padding backdrop-filter backdrop-blur-md shadow-md rounded-lg">
          <aside>
            <p className="flex justify-between space-x-5">
              Copyright &copy; {new Date().getFullYear()} - All rights reserved by Myself
              <img src={'/clown.gif'} className="ml-auto w-5" /> | By Iminthebibleson
            </p>          </aside>
        </footer>
      </div>
    </>
  );
}
